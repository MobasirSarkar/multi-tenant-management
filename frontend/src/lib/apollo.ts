import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const uri = import.meta.env.VITE_GRAPHQL_URL;

const options: ApolloClient.Options = {
    cache: cache,
    link: new HttpLink({
        uri: uri,
    }),
};

export const client = new ApolloClient(options);
