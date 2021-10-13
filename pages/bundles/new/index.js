import { gql, useMutation } from "@apollo/client";
import { Badge, Card, Grid, Spacer, useTheme } from "@geist-ui/react";
import BundleCard from "components/BundleCard";
import BundleForm from "components/BundleForm";
import Layout from "components/Layout";
import { Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";

function newBundle() {
  const router = useRouter();
  const theme = useTheme();

  const bundle = {
    title: "",
    description: "",
    object_position: "",
    subtitle: "",
    cover_image: "",
    category_id: "",
    is_airbnb_plus: false,
  };

  const [insertBundle, mutationOptions] = useMutation(
    gql`
      mutation insertSet($object: set_insert_input!) {
        insert_set_one(object: $object) {
          id
        }
      }
    `
  );

  const handleSubmit = async (values, actions) => {
    const newBundle = await insertBundle({
      variables: {
        object: {
          title: values?.title || "",
          description: values?.description || "",
          object_position: values?.object_position || "",
          subtitle: values?.subtitle || "",
          cover_image: values?.cover_image || "",
          category_id: values?.category_id || "",
          is_airbnb_plus: values?.is_airbnb_plus || false,
        },
      },
    });
    if (newBundle) {
      actions.resetForm();
      return router.push(
        `/bundles/edit/${newBundle?.data?.insert_set_one?.id}`
      );
    }
  };
  return (
    <Layout>
      <div>
        <Head>
          <title>AirBundles Admin</title>
          <meta name="description" content="AirBundles Admin page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Card width="100%">
            <h1>New Bundle</h1>
            <Formik
              initialValues={bundle}
              enableReinitialize
              onSubmit={(values, actions) => handleSubmit(values, actions)}
            >
              {(formik) => (
                <>
                  <Grid.Container gap={2}>
                    <Grid xs={24} sm={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <BundleForm
                          mutationOptions={mutationOptions}
                          formik={formik}
                        />
                      </div>
                    </Grid>
                    <Grid xs={24} sm={12}>
                      {formik?.values && (
                        <>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div style={{ width: 400 }}>
                              <BundleCard
                                image={
                                  formik?.values?.cover_image ||
                                  formik?.values?.photo_url
                                }
                                title={formik?.values?.title}
                                url={formik?.values?.url}
                                subtitle={formik?.values?.subtitle}
                                btnText=""
                                objectPosition={formik?.values?.object_position}
                                badge={
                                  formik?.values?.is_airbnb_plus ? (
                                    <>
                                      <Spacer w={0.5} />
                                      <Badge
                                        style={{
                                          backgroundColor: theme.palette.alert,
                                        }}
                                      >
                                        Airbnb Plus
                                      </Badge>
                                    </>
                                  ) : null
                                }
                              />
                            </div>
                            <pre>{JSON.stringify(formik?.values, null, 4)}</pre>
                          </div>
                        </>
                      )}
                    </Grid>
                  </Grid.Container>
                </>
              )}
            </Formik>
          </Card>
        </main>
      </div>
    </Layout>
  );
}

export default newBundle;
