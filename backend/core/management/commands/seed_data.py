from django.core.management.base import BaseCommand
from core.models import Organization, Project, Task


class Command(BaseCommand):
    help = "Seeds initial data for the application"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        org_name = "TechNova Solutions"
        org_slug = "technova-solutions"

        org, created = Organization.objects.get_or_create(
            slug=org_slug,
            defaults={
                "name": org_name,
                "contact_email": "admin@technova.com",
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created Organization: {org_name}"))
        else:
            self.stdout.write(
                self.style.WARNING(f"Organization {org_name} already exists")
            )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully."))
