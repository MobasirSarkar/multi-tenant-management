from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User


class Organization(models.Model):
    name = models.CharField(max_length=100)

    # The slug identifies the tenant in the URL (e.g. /mobasir/dashboard)
    slug = models.SlugField(unique=True, blank=True)
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    members = models.ManyToManyField(User, related_name="organizations", blank=True)

    def save(self, *args, **kwargs):
        # Automatically create a slug from the name if not provided.
        if not self.slug:
            self.slug = slugify(str(self.name))
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.name)


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"  # type: ignore
        COMPLETED = "COMPLETED", "Completed"  # type: ignore
        ON_HOLD = "ON_HOLD", "On Hold"  # type: ignore

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="projects",  # allows organization.projects.all()
    )

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.organization.name})"


class Task(models.Model):
    class Status(models.TextChoices):
        TODO = "TODO", "To Do"  # type: ignore
        IN_PROGRESS = "IN_PROGRESS", "In Progress"  # type: ignore
        DONE = "DONE", "Done"  # type: ignore

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TODO,
    )
    assignee_email = models.EmailField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)


class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    author_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author_email} on {self.task.title}"  # type:ignore
