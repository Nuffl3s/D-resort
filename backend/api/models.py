from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.files.storage import FileSystemStorage
from django.db.models import JSONField
from django.db import models

image_storage = FileSystemStorage(
    # Define where to save the images
    location='media/images', 
    base_url='/media/images/'
)

class CustomUser(AbstractUser):
    USER_TYPES = (
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='Employee')

    # Avoid conflicts by setting unique related_name
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_groups",  # Unique related name
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions",  # Unique related name
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.username
    
class Employee(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class WeeklySchedule(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    schedule = models.JSONField()  # Stores a dictionary with all days' schedules

    def __str__(self):
        return f"Weekly Schedule for {self.employee.name}"

class Product(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    avgPrice = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Payroll(models.Model):
    STATUS_CHOICES = [
        ('Calculated', 'Calculated'),
        ('Not yet', 'Not yet'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, default=1)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Not yet")

    def __str__(self):
        return f"{self.employee.name} - {self.status} - ${self.net_pay:.2f}"
    
class Log(models.Model):
    CATEGORY_CHOICES = [
        ("Employee Registration", "Employee Registration"),
        ("Attendance", "Attendance"),
        ("Payroll", "Payroll"),
        ("Report", "Report"),
        ("Inventory", "Inventory"),
        ("Booking", "Booking"),
        ("System", "System"),
    ]

    username = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="System")  # Add this field
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.action} - {self.category}"

class Cottage(models.Model):
    name = models.CharField(max_length=255, default="Unnamed Cottage", unique=True)
    image = models.ImageField(storage=image_storage, upload_to="cottage_images/", null=True, blank=True)
    type = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField()
    custom_prices = models.JSONField(default=dict)  # Updated import used here

    def __str__(self):
        return f"{self.type} - {self.name}"

class Lodge(models.Model):
    name = models.CharField(max_length=255, default="Unnamed Lodge", unique=True)
    image = models.ImageField(storage=image_storage, upload_to="lodge_images/")
    type = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField()
    custom_prices = models.JSONField(default=dict)  # Updated import used here

    def __str__(self):
        return f"{self.type} - {self.name}"

