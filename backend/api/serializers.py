from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Employee, Product, Payroll, CustomUser, Log, WeeklySchedule, Cottage, Lodge


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

class CottageSerializer(serializers.ModelSerializer):
    unit_type = serializers.CharField(write_only=True)  # Accept 'unit_type' from frontend

    class Meta:
        model = Cottage
        fields = ['id', 'name', 'image', 'capacity', 'custom_prices', 'unit_type', 'type']
        extra_kwargs = {'type': {'required': False}}  # 'type' will be populated from 'unit_type'

    def create(self, validated_data):
        validated_data['type'] = validated_data.pop('unit_type', None)  # Map 'unit_type' to 'type'
        return super().create(validated_data)

class LodgeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    unit_type = serializers.CharField(write_only=True)  # Add this to handle unit_type

    class Meta:
        model = Lodge
        fields = ['id', 'name', 'image_url', 'type', 'unit_type', 'capacity', 'custom_prices']
        extra_kwargs = {
            'type': {'required': True},  # Ensure type is required
        }

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        # Map unit_type to type
        validated_data['type'] = validated_data.pop('unit_type')
        return super().create(validated_data)
