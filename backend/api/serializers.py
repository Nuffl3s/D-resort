from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Employee, Schedule, Product, Payroll


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['name', 'address']
        
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = [
            'employee',
            'monday_start', 'monday_end', 'monday_duty', 'monday_day_off',
            'tuesday_start', 'tuesday_end', 'tuesday_duty', 'tuesday_day_off',
            'wednesday_start', 'wednesday_end', 'wednesday_duty', 'wednesday_day_off',
            'thursday_start', 'thursday_end', 'thursday_duty', 'thursday_day_off',
            'friday_start', 'friday_end', 'friday_duty', 'friday_day_off',
            'saturday_start', 'saturday_end', 'saturday_duty', 'saturday_day_off',
            'sunday_start', 'sunday_end', 'sunday_duty', 'sunday_day_off',
        ]

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