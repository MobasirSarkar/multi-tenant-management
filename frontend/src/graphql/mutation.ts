import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql(`
mutation CreateProject($orgSlug: String!, $name: String!, $description: String, $dueDate: Date) {
    createProject(orgSlug: $orgSlug, name: $name, description: $description, dueDate: $dueDate) {
      project {
        id
        name
        status
        taskCount
        completedTaskCount
      }
    }
  }
`);

export const CREATE_TASK = gql(`
  mutation CreateTask($projectId: ID!, $title: String!, $description: String, $assigneeEmail: String) {
    createTask(projectId: $projectId, title: $title, description: $description, assigneeEmail: $assigneeEmail) {
      task {
        id
        title
        status
      }
    }
  }
`);

export const UPDATE_TASK_STATUS = gql(`
mutation UpdateTaskStatus($taskId: ID!, $status: String!) {
    updateTaskStatus(taskId: $taskId, status: $status) {
      task {
        id
        status
      }
    }
  }
`);

export const CREATE_COMMENT = gql(`
  mutation CreateComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    createComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`);

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      id
    }
  }
`;
