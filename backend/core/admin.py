from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Organization, Project, Task, TaskComment

admin.site.unregister(User)


class OrganizationInline(admin.TabularInline):
    model = Organization.members.through
    extra = 0
    verbose_name = "Organization Membership"
    verbose_name_plural = "Organization Memberships"


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [OrganizationInline]
    list_display = ("username", "email", "first_name", "last_name", "is_staff")


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "contact_email", "created_at")
    search_fields = ("name", "slug")
    filter_horizontal = ("members",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "status", "due_date")
    list_filter = ("organization", "status")
    search_fields = ("name",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "status", "assignee_email")
    list_filter = ("project__organization", "status")
    search_fields = ("title", "assignee_email")


@admin.register(TaskComment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("task", "author_email", "created_at")
