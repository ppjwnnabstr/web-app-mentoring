from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User, MentorProfile, MenteeProfile


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("username", "email", "employee_no", "role", "department", "is_active")
    list_filter = ("role", "department", "is_active")
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("SVI profile", {"fields": ("employee_no", "role", "department")}),
    )


@admin.register(MentorProfile)
class MentorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "availability", "capacity", "is_accepting")
    search_fields = ("user__first_name", "user__last_name", "user__employee_no")


@admin.register(MenteeProfile)
class MenteeProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "frequency")
    search_fields = ("user__first_name", "user__last_name", "user__employee_no")
