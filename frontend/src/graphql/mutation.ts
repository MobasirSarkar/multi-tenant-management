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

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID!, $name: String, $description: String, $status: String, $dueDate: Date) {
    updateProject(projectId: $projectId, name: $name, description: $description, status: $status, dueDate: $dueDate) {
      project {
        id
        name
        description
        status
        dueDate
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($orgSlug: String!, $email: String!, $username: String!, $password: String!) {
    createUser(orgSlug: $orgSlug, email: $email, username: $username, password: $password) {
      user {
        id
        username
      }
    }
  }
`;
