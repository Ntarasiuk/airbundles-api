import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://airsupplies.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": "airsupplies2021!",
  },
});
