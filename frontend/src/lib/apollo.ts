import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloLink,
} from "@apollo/client";

const cache = new InMemoryCache();
const uri = import.meta.env.VITE_GRAPHQL_URL;

const httpLink = new HttpLink({
    uri: uri,
});

const authLink = new ApolloLink((operation, forward) => {
    // Get the token from local storage
    const token = localStorage.getItem("token");

    // Modify the operation context directly
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : "",
        },
    }));

    return forward(operation);
});

const options: ApolloClient.Options = {
    cache: cache,
    link: authLink.concat(httpLink),
};

export const client = new ApolloClient(options);
