import { useQuery } from "@apollo/client";
import {
  Badge,
  Divider,
  Grid,
  Loading,
  Spacer,
  Text,
  useTheme,
} from "@geist-ui/react";
import BundleCard from "components/BundleCard";
import Layout from "components/Layout";
import gql from "graphql-tag";
import Head from "next/head";
import React from "react";

function SetPage() {
  const theme = useTheme();

  const { data, loading, error } = useQuery(gql`
    {
      category(order_by: { name: asc_nulls_last }) {
        slug
        description
        name
        sets {
          id
          cover_image
          object_position
          description
          subtitle
          title
          is_airbnb_plus
        }
      }
    }
  `);

  const catData = data?.category || [];
  if (loading)
    return (
      <Layout>
        <Loading>Loading</Loading>
      </Layout>
    );
  return (
    <Layout>
      <Text h3 type="secondary">
        Bundles
      </Text>
      {catData?.map((cat, index) => (
        <div key={cat?.id} style={{ marginBottom: 40 }}>
          {cat?.name ? (
            <Divider mt={index === 0 ? 4 : 12} mb={12}>
              <h3 style={{ marginBottom: 0 }}>{cat.name}</h3>
            </Divider>
          ) : null}
          <Grid.Container gap={5}>
            {[...cat?.sets]?.map((set) => (
              <Grid xs={24} md={12} lg={8} xl={6} key={set?.id}>
                <BundleCard
                  id={set?.id}
                  image={set?.cover_image}
                  title={set?.title}
                  content={set?.subtitle}
                  btnText="Check out the list"
                  stars={5}
                  objectPosition={set?.object_position}
                  link={`/bundles/${cat?.slug}/${set?.id}`}
                  showStars={false}
                  badge={
                    set?.is_airbnb_plus ? (
                      <>
                        <Spacer w={0.5} />
                        <Badge style={{ backgroundColor: theme.palette.alert }}>
                          Airbnb Plus
                        </Badge>
                      </>
                    ) : null
                  }
                />
              </Grid>
            ))}
          </Grid.Container>
        </div>
      ))}
    </Layout>
  );
}

const bundles = () => (
  <>
    <Head>
      <title>Choose a Bundle | AirBundles</title>
      <meta
        property="og:description"
        content="Bundles of amazing products for your every hosting need"
      />
      <meta property="og:site_name" content="AirBundles" />
      <meta property="og:url" content="https://airbundles.com/bundles" />
      <meta property="og:image" content="https://airbundles.com/og_image.jpg" />
    </Head>
    <SetPage />
  </>
);
export default bundles;
