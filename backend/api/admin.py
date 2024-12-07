from django.contrib import admin
from .models import Cottage, Lodge

admin.site.register(Cottage)
admin.site.register(Lodge)

from django.contrib import admin
from django.urls import path, include

from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # Adjust as needed
