import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment, description


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = "__all__"


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = "__all__"


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_task_count = graphene.Int()

    class Meta:
        model = Project
        fields = "__all__"

    def resolve_task_count(self, _info):
        return self.tasks.count()  # type: ignore - "tasks" is a reverse relation dynamic attribute

    def resolve_completed_task_count(self, _info):
        return self.tasks.filter(status="DONE").count()  # type: ignore


# --- 2. Define Queries ---


class Query(graphene.ObjectType):
    projects = graphene.List(ProjectType, org_slug=graphene.String(required=True))
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    my_tasks = graphene.List(TaskType)

    def resolve_projects(self, _info, org_slug):
        return Project.objects.filter(organization__slug=org_slug).order_by(  # type: ignore - "objects" is a dynamic Django manager
            "-created_at"
        )

    def resolve_project(self, _info, id):
        return Project.objects.get(pk=id)  # type: ignore

    def resolve_my_tasks(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return Task.objects.none()

        return Task.objects.filter(assignee_email=user.email).order_by(
            "due_date", "-created_at"
        )[:5]


class CreateProjectMutation(graphene.Mutation):
    class Arguments:
        org_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, _info, org_slug, name, description="", due_date=None):
        try:
            org = Organization.objects.get(slug=org_slug)
            project = Project.objects.create(
                organization=org, name=name, description=description, due_date=due_date
            )
            return CreateProjectMutation(project=project)
        except Organization.DoesNotExist:
            raise Exception("Organization not found")


class UpdateProjectMutation(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)

    def mutate(
        self, _info, project_id, name=None, description=None, status=None, due_date=None
    ):
        project = Project.objects.get(pk=project_id)

        if name:
            project.name = name

        if description:
            project.description = description

        if status:
            project.status = status

        if due_date:
            project.due_date = due_date

        project.save()
        return UpdateProjectMutation(project=project)


# --- 3. Define Mutations ---
class CreateTaskMutation(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        assignee_email = graphene.String()

    task = graphene.Field(TaskType)

    def mutate(self, _info, project_id, title, description="", assignee_email=""):
        project = Project.objects.get(pk=project_id)  # type: ignore
        task = Task.objects.create(  # type: ignore
            project=project,
            title=title,
            description=description,
            assignee_email=assignee_email,
        )
        return CreateTaskMutation(task=task)  # type: ignore - Graphene handles the dynamic constructor


class UpdateTaskStatusMutation(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        status = graphene.String(required=True)

    task = graphene.Field(TaskType)

    def mutate(self, _info, task_id, status):
        task = Task.objects.get(pk=task_id)  # type: ignore
        task.status = status
        task.save()
        return UpdateTaskStatusMutation(task=task)  # type: ignore


class DeleteTaskMutation(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)

    id = graphene.ID()

    def mutate(self, _info, task_id):
        task = Task.objects.get(pk=task_id)
        task.delete()
        return DeleteTaskMutation(id=task_id)


class CreateCommentMutation(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, _info, task_id, content, author_email):
        task = Task.objects.get(pk=task_id)  # type: ignore
        comment = TaskComment.objects.create(  # type: ignore
            task=task,
            content=content,
            author_email=author_email,
        )
        return CreateCommentMutation(comment=comment)  # type: ignore


class UpdateCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(requried=True)
        content = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, _info, comment_id, content):

        comment = TaskComment.objects.get(pk=comment_id)
        comment.content = content
        comment.save()
        return UpdateCommentMutation(comment=comment)


class Mutation(graphene.ObjectType):
    # Auth Mutations
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    # Project Mutation
    create_project = CreateProjectMutation.Field()
    update_project = UpdateProjectMutation.Field()
    create_task = CreateTaskMutation.Field()
    update_task_status = UpdateTaskStatusMutation.Field()
    create_comment = CreateCommentMutation.Field()
    update_comment = CreateCommentMutation.Field()
    delete_task = DeleteTaskMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
