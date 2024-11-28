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
    description = serializers.SerializerMethodField()  # Dynamically computed field

    class Meta:
        model = Cottage
        fields = [
            'id', 'image', 'type', 'capacity', 'description',
            'time_6am_6pm_price', 'time_6am_12mn_price', 'time_12hrs_price', 'time_24hrs_price',
        ]

    def get_description(self, obj):
        # Dynamically compute the description based on capacity
        return f"Good for up to {obj.capacity} people."


class LodgeSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()  # Dynamically computed field

    class Meta:
        model = Lodge
        fields = [
            'id', 'image', 'type', 'capacity', 'description',
            'time_3hrs_price', 'time_6hrs_price', 'time_12hrs_price', 'time_24hrs_price',
        ]

    def get_description(self, obj):
        # Dynamically compute the description based on capacity
        return f"Comfortably accommodates {obj.capacity} people."
