import pytest
from mixer.backend.django import mixer
from graphene.test import Client
from core.schema import schema
from core.models import Project, Task

# Initialize GraphQL Client
client = Client(schema)


@pytest.mark.django_db
def test_tenant_isolation():
    """
    Ensure fetching projects filters correctly by Organization slug.
    """
    # 1. Setup Data
    org_a = mixer.blend("core.Organization", name="Acme", slug="acme")
    org_b = mixer.blend("core.Organization", name="Beta", slug="beta")

    # Create projects for both orgs
    project_a = mixer.blend("core.Project", organization=org_a, name="Project A")
    project_b = mixer.blend("core.Project", organization=org_b, name="Project B")

    # 2. Execute Query for Org A
    query = """
        query {
            projects(orgSlug: "acme") {
                name
            }
        }
    """
    response = client.execute(query)

    # 3. Verify Results
    data = response.get("data").get("projects")

    assert len(data) == 1
    assert data[0]["name"] == "Project A"
    # Critical: Should NOT see Project B
    assert "Project B" not in [p["name"] for p in data]


@pytest.mark.django_db
def test_create_task_mutation():
    """
    Ensure the createTask mutation saves data to the DB.
    """
    # 1. Setup Data
    project = mixer.blend("core.Project")

    # 2. Execute Mutation
    mutation = f"""
        mutation {{
            createTask(
                projectId: "{project.id}", 
                title: "Test Task", 
                assigneeEmail: "test@test.com"
            ) {{
                task {{
                    id
                    title
                    status
                }}
            }}
        }}
    """
    response = client.execute(mutation)

    # 3. Verify Response
    data = response.get("data").get("createTask").get("task")
    assert data["title"] == "Test Task"
    assert data["status"] == "TODO"

    # 4. Verify Database
    assert Task.objects.count() == 1
    assert Task.objects.first().project == project
