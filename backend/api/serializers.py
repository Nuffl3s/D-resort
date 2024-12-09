from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge
from .models import Attendance


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "user_type"]
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
    date_added = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)  # Include this field
    class Meta:
        model = Product
        fields = ['name', 'quantity', 'avgPrice', 'amount', 'date_added']
        extra_kwargs = {
            'amount':{'required': False}
        }

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
    name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['user', 'name', 'date', 'time_in', 'time_out']
