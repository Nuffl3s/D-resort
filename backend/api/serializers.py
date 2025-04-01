
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType
from .models import Account
from rest_framework import serializers
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge, Reservation, CustomerAccount
from .models import Attendance
from .models import Account
from .models import PayrollList


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "user_type"]  # Remove "employee" field
        extra_kwargs = {
            "password": {"write_only": True},  # Prevent password from being read back
        }

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'user_type']
        
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['name', 'address']

class CreateAccountSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(write_only=True)  # Employee name is not to be included in the response

    class Meta:
        model = Account
        fields = ['user', 'employee_name']  # Specify the fields you want to serialize

    def create(self, validated_data):
        employee_name = validated_data.get('employee_name')  # Get employee name from the validated data
        
        # Try to retrieve the employee by name
        try:
            employee = Employee.objects.get(name=employee_name)
        except Employee.DoesNotExist:
            raise serializers.ValidationError("Employee not found")  # Provide a clearer error message

        # Create and return the account with the linked user and employee
        account = Account.objects.create(
            user=validated_data.get('user'),  # This should be the user object passed in the validated data
            employee=employee
        )
        return account

class WeeklyScheduleSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source='employee.name')

    class Meta:
        model = WeeklySchedule
        fields = ['id', 'employee', 'schedule']

    def validate(self, data):
        schedule = data.get('schedule', {})
        # Enforce day order
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        ordered_schedule = {day: schedule.get(day, {}) for day in day_order}
        data['schedule'] = ordered_schedule
        return data


class ProductSerializer(serializers.ModelSerializer):
    date_added = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Product
        fields = ['name', 'quantity', 'avgPrice', 'acquisitionCost', 'sellingPrice', 'amount', 'date_added']
        extra_kwargs = {
            'amount': {'required': False},
            'acquisitionCost': {'required': False},
            'sellingPrice': {'required': False},  # Add sellingPrice field
        }

    def create(self, validated_data):
        # Ensure acquisitionCost is not null, if not provided, set it to 0
        acquisitionCost = validated_data.get('acquisitionCost', 0)  # Set default to 0 if missing
        quantity = validated_data.get('quantity', 0)
        validated_data['amount'] = quantity * acquisitionCost
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Update amount if fields change
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.acquisitionCost = validated_data.get('acquisitionCost', instance.acquisitionCost)  # Default if missing
        instance.sellingPrice = validated_data.get('sellingPrice', instance.sellingPrice)  # Update sellingPrice
        instance.amount = instance.quantity * instance.acquisitionCost  # Recalculate amount based on acquisition cost
        instance.save()
        return instance


class PayrollListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollList
        fields = ['id', 'employee', 'net_pay', 'status']

class PayrollSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source='employee.name')  # Display employee name instead of ID

    class Meta:
        model = Payroll
        fields = ['id', 'employee', 'rate', 'total_hours', 'deductions', 'cash_advance', 'net_pay', 'status']
        read_only_fields = ['net_pay']  # Calculated automatically

    def update(self, instance, validated_data):
        # Ensure that rate is being passed in validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Recalculate net pay
        instance.calculate_net_pay()
        instance.save()  # Save the instance after updating the rate
        return instance

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ["id", "username", "action", "category", "timestamp"]

class BaseUnitSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        custom_prices = data.get("custom_prices", {})
        normalized_prices = {key.upper(): value for key, value in custom_prices.items()}
        data["custom_prices"] = normalized_prices
        return data

    def validate_custom_prices(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("custom_prices must be a dictionary.")
        return value

    def validate_type(self, value):
        # Default to "Cottage" if type is missing or blank
        if not value:
            return "Cottage"
        return value.capitalize()

class LodgeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    prices = serializers.SerializerMethodField()
    class Meta:
        model = Lodge
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        custom_prices = data.get("custom_prices", {})
        # Normalize keys: remove spaces and convert to uppercase
        normalized_prices = {key.replace(" ", "").upper(): value for key, value in custom_prices.items()}
        data["custom_prices"] = normalized_prices
        return data
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    def get_prices(self, obj):
        return obj.custom_prices


class CottageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    prices = serializers.SerializerMethodField()
    class Meta:
        model = Cottage
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        custom_prices = data.get("custom_prices", {})
        # Normalize keys: remove spaces and convert to uppercase
        normalized_prices = {key.replace(" ", "").upper(): value for key, value in custom_prices.items()}
        data["custom_prices"] = normalized_prices
        return data
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    def get_prices(self, obj):
        # Return custom_prices directly
        return obj.custom_prices

class AttendanceSerializer(serializers.ModelSerializer):
    time_out = serializers.TimeField(required=False, allow_null=True)  # TimeField for time_out

    class Meta:
        model = Attendance
        fields = ['user', 'name', 'date', 'time_in', 'time_out']

class UnitDetailsSerializer(serializers.Serializer):
    image = serializers.CharField()
    capacity = serializers.IntegerField()
    custom_prices = serializers.JSONField()

class ReservationSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone_number', read_only=True)
    customer = serializers.PrimaryKeyRelatedField(
        queryset=CustomerAccount.objects.all(),
        required=False  # Not required for authenticated customers
    )
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'customer', 'customer_name', 'customer_email', 'customer_phone',
            'unit_type', 'unit_name', 'transaction_date', 'date_of_reservation',
            'date_range', 'time_of_use', 'total_price', 'image_url'
        ]
        extra_kwargs = {
            'customer': {'required': False}
        }

    def create(self, validated_data):
        # Allow staff users to specify customer, else use logged-in user
        if 'customer' not in validated_data:
            if hasattr(self.context['request'].user, 'customer_account'):
                validated_data['customer'] = self.context['request'].user.customer_account
            else:
                raise serializers.ValidationError("Customer account required.")
        
        return super().create(validated_data)
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.unit_type.lower() == "cottage":
            try:
                unit = Cottage.objects.get(name=obj.unit_name)
                if unit.image and request:
                    return request.build_absolute_uri(unit.image.url)
            except Cottage.DoesNotExist:
                return None
        elif obj.unit_type.lower() == "lodge":
            try:
                unit = Lodge.objects.get(name=obj.unit_name)
                if unit.image and request:
                    return request.build_absolute_uri(unit.image.url)
            except Lodge.DoesNotExist:
                return None
        return None
    
class CustomerAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomerAccount
        fields = ['id', 'username', 'name', 'phone_number', 'email', 'password', 'user_type']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
class CustomerAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAccount
        fields = ['id', 'username', 'name', 'phone_number', 'email']