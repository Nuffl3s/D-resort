from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge, Reservation
from .models import Attendance


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
        # Compute amount if not provided
        quantity = validated_data.get('quantity', 0)
        acquisitionCost = validated_data.get('acquisitionCost', 0)
        validated_data['amount'] = quantity * acquisitionCost
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Update amount if fields change
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.acquisitionCost = validated_data.get('acquisitionCost', instance.acquisitionCost)
        instance.sellingPrice = validated_data.get('sellingPrice', instance.sellingPrice)  # Update sellingPrice
        instance.amount = instance.quantity * instance.acquisitionCost  # Recalculate amount based on acquisition cost
        instance.save()
        return instance


class PayrollSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source='employee.name')  # Display employee name instead of ID

    class Meta:
        model = Payroll
        fields = ['id', 'employee', 'net_pay', 'status']

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
    transaction_date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    date_of_reservation = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.all(), required=False)
    object_id = serializers.IntegerField(required=False)
    unit_details = serializers.SerializerMethodField()  # Add this field
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_mobile', 'unit_type', 'unit_name',
            'date_of_reservation', 'time_of_use', 'total_price',
            'transaction_date', 'content_type', 'object_id', 'unit_details'
        ]

    def get_unit_details(self, obj):
        if not obj.content_type or not obj.object_id:
            return None
        try:
            unit_model = obj.content_type.get_object_for_this_type(id=obj.object_id)
            return {
                "image": unit_model.image.url if hasattr(unit_model, "image") and unit_model.image else "/static/default-image.jpg",
                "capacity": getattr(unit_model, "capacity", "N/A"),
                "custom_prices": getattr(unit_model, "custom_prices", {}),
            }
        except Exception as e:
            print(f"Error fetching unit details: {e}")
            return None

