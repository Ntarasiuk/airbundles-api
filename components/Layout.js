import { Grid, Page } from "@geist-ui/react";
import Link from "next/link";
import React from "react";
import styles from "styles/Home.module.css";

function Layout({ children }) {
  return (
    <div>
      <Page className={styles.page}>
        <Page.Header>
          <Grid.Container gap={2}>
            <Grid md={12} xs>
              <Link href="/" passHref>
                <a style={{ color: "black", textDecoration: "none" }}>
                  <h2>AirBundles Admin</h2>
                </a>
              </Link>
            </Grid>
          </Grid.Container>
        </Page.Header>
        <Page.Content>{children}</Page.Content>
        <Page.Footer>{/* <h2>Contact</h2>  */}</Page.Footer>
      </Page>
    </div>
  );
}

export default Layout;
