from django.db import models
from base.models import BaseModel
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser, BaseModel):
    USER_ROLES = (
        ('customer', 'Customer'),
        ('provider', 'Service Provider'),
        ('admin', 'Admin'),
    )
    
    
    phone = models.CharField(max_length=20, unique=True)
    
    
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=USER_ROLES, default='customer')    
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    

    
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default='Kathmandu')
    
     # Provider Fields

    SKILLS_CHOICES = (
        ('plumber', 'Plumber'),
        ('electrician', 'Electrician'),
        ('cleaner', 'Cleaner'),
        ('painter', 'Painter'),
        ('gardener', 'Gardener'),
    )

    skills = models.CharField(max_length=50, choices=SKILLS_CHOICES, blank=True, null=True)
    experience_years = models.PositiveIntegerField(default=0)
    
    citizenship_image_front = models.ImageField(upload_to='citizenship/', blank=True, null=True)
    citizenship_image_back = models.ImageField(upload_to='citizenship/', blank=True, null=True)
 # Profile image
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    # Account status
    status = models.CharField(max_length=20,choices=[('active', 'Active'), ('blocked', 'Blocked')],default='active')
    
    provider_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['email', 'role']
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = f"user_{self.phone}"  # auto-generate username
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    
# These 2 models are not real database tables, they are just reusing the same User table 
# Doing this to separate Customer and Provider in admin panel

class Customer(User):
    class Meta:
        proxy = True #This model is just another view of the same database table.
        verbose_name = "Customer"
        verbose_name_plural = "Customers"


class ServiceProvider(User):
    class Meta:
        proxy = True
        verbose_name = "Service Provider"
        verbose_name_plural = "Service Providers"
