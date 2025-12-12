import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($orgSlug: String!) {
    projects(orgSlug: $orgSlug) {
      id
      name
      status
      taskCount
      completedTaskCount
    }
    myTasks {
      id
      title
      status
      project {
        id
        name
      }
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql(
    `query GetProjects($orgSlug: String!) {
    projects(orgSlug: $orgSlug) {
      id
      name
      status
      taskCount
      completedTaskCount
      dueDate
      tasks {
        id
        title
        status
        assigneeEmail
      }
    }
  }
    `,
);

export const GET_PROJECTS_DETAILS = gql`
  query GetProjectDetails($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      tasks {
        id
        title
        status
        assigneeEmail
        description
        createdAt
        comments {
          id
          content
          authorEmail
          createdAt
        }
      }
    }
  }
`;

export const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      tasks {
        id
        title
        status
        assigneeEmail
        description
        createdAt
        comments {
          id
          content
          authorEmail
          createdAt
        }
      }
    }
  }
`;

export const GET_MY_ORGS = gql`
  query GetMyOrgs {
    me {
      id
      username
      isStaff
      organizations {
        slug
        name
      }
    }
  }
`;

export const GET_ORG_TEAM = gql`
  query GetOrgTeam($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      members {
        id
        username
        email
        isStaff
      }
    }
  }
`;
