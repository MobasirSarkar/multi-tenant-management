from django.contrib import admin
from .models import Organization, Project, Task, TaskComment


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "contact_email", "created_at")
    search_fields = ("name", "slug")


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
