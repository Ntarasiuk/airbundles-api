import { ApolloProvider } from "@apollo/client";
import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { Toaster } from "react-hot-toast";
import { client } from "utils/apollo";
import "../public/quill.snow.css";

const Application = ({ Component, pageProps }) => (
  <ApolloProvider client={client}>
    <Toaster />
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />{" "}
    </GeistProvider>
  </ApolloProvider>
);

export default Application;
