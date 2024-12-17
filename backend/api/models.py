from django.contrib.auth.models import AbstractUser, Group, Permission, AbstractBaseUser, BaseUserManager
from django.core.files.storage import FileSystemStorage
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import JSONField
from django.db import models
from datetime import timedelta
from django.conf import settings

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
    biometric_data = models.BinaryField(null=True, blank=True)

    def __str__(self):
        return self.name

class Account(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)  # Changed to OneToOneField

    def __str__(self):
        return f"Account for {self.employee.name}"
class Attendance(models.Model):
    date = models.DateField()
    user = models.ForeignKey('Employee', on_delete=models.CASCADE)  # Link to Employee model
    time_in = models.TimeField()
    time_out = models.TimeField(null=True, blank=True)  # Allow null for time_out

    def __str__(self):
        return f"{self.user.name} - {self.date} - {self.time_in} - {self.time_out}"

    @property
    def name(self):
        return self.user.name  # Fetches the name from the related Employee model


class WeeklySchedule(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    schedule = models.JSONField()  # Stores a dictionary with all days' schedules

    def __str__(self):
        return f"Weekly Schedule for {self.employee.name}"

class Product(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    avgPrice = models.DecimalField(max_digits=10, decimal_places=2)
    acquisitionCost = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sellingPrice = models.DecimalField(max_digits=10, decimal_places=2)  # Ensure this is a numeric field
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    
class Payroll(models.Model):
    STATUS_CHOICES = [
        ('Calculated', 'Calculated'),
        ('Not yet', 'Not yet'),
    ]
    PAYROLL_TYPE_CHOICES = [
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
    ]

    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, default=1)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Not yet")
    payroll_type = models.CharField(max_length=50, choices=PAYROLL_TYPE_CHOICES, default="Weekly")
    last_updated = models.DateTimeField(auto_now=True)

    def should_reset(self):
        """Determine if the payroll status should be reset to 'Not yet'."""
        now = timezone.now()
        if self.payroll_type == "Weekly":
            return (now - self.last_updated).days >= 6
        elif self.payroll_type == "Monthly":
            next_month = self.last_updated + timedelta(days=30)
            reset_day = next_month - timedelta(days=1)
            return now >= reset_day
        return False

    def reset_status(self):
        """Reset status to 'Not yet' if conditions are met."""
        if self.should_reset():
            self.status = "Not yet"
            self.save()

class Payroll(models.Model):
    STATUS_CHOICES = [
        ('Calculated', 'Calculated'),
        ('Not yet', 'Not yet'),
    ]

    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, default=1)  # Changed to OneToOneField
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
    image = models.ImageField(storage=image_storage, upload_to="lodge_images/", null=True, blank=True)
    type = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField()
    custom_prices = models.JSONField(default=dict)  # Updated import used here

    def __str__(self):
        return f"{self.type} - {self.name}"
    
class Reservation(models.Model):
    customer = models.ForeignKey('CustomerAccount', on_delete=models.CASCADE)  # Use a string reference
    unit_type = models.CharField(max_length=50)
    unit_name = models.CharField(max_length=255)
    transaction_date = models.DateField(auto_now_add=True)
    date_of_reservation = models.DateField()
    time_of_use = models.CharField(max_length=50, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Reservation for {self.customer.name} - {self.unit_name}"


class CustomerAccountManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError("Email is required")
        customer = self.model(username=username, email=self.normalize_email(email))
        customer.set_password(password)
        customer.save(using=self._db)
        return customer
    
class CustomerAccount(AbstractBaseUser):
    USER_TYPE_CHOICES = [('Customer', 'Customer')]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='customer_account')
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='Customer')

    objects = CustomerAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username