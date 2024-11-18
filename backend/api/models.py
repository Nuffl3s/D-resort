from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Schedule(models.Model):
    DUTY_CHOICES = [
        ('Store Duty', 'Store Duty'),
        ('Cleaning Duty', 'Cleaning Duty'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='schedules')
    
    monday_start = models.TimeField(null=True, blank=True)
    monday_end = models.TimeField(null=True, blank=True)
    monday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    monday_day_off = models.BooleanField(default=False)

    tuesday_start = models.TimeField(null=True, blank=True)
    tuesday_end = models.TimeField(null=True, blank=True)
    tuesday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    tuesday_day_off = models.BooleanField(default=False)
    
    wednesday_start = models.TimeField(null=True, blank=True)
    wednesday_end = models.TimeField(null=True, blank=True)
    wednesday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    wednesday_day_off = models.BooleanField(default=False)
    
    thursday_start = models.TimeField(null=True, blank=True)
    thursday_end = models.TimeField(null=True, blank=True)
    thursday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    thursday_day_off = models.BooleanField(default=False)
    
    friday_start = models.TimeField(null=True, blank=True)
    friday_end = models.TimeField(null=True, blank=True)
    friday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    friday_day_off = models.BooleanField(default=False)
    
    saturday_start = models.TimeField(null=True, blank=True)
    saturday_end = models.TimeField(null=True, blank=True)
    saturday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    saturday_day_off = models.BooleanField(default=False)
    
    sunday_start = models.TimeField(null=True, blank=True)
    sunday_end = models.TimeField(null=True, blank=True)
    sunday_duty = models.CharField(max_length=100, choices=DUTY_CHOICES, blank=True)
    sunday_day_off = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.employee.name}'s schedule"
    
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
    
