import { gql, useMutation, useQuery } from "@apollo/client";
import { Badge, Card, Grid, Spacer, useTheme } from "@geist-ui/react";
import BundleCard from "components/BundleCard";
import BundleForm from "components/BundleForm";
import Layout from "components/Layout";
import { Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import toast from "react-hot-toast";

function editBundle() {
  const { query } = useRouter();
  const theme = useTheme();
  console.log(query);
  const SET_QUERY = gql`
    query Set($id: Int!) {
      set_by_pk(id: $id) {
        id
        category_id
        cover_image
        object_position
        description
        subtitle
        title
        is_airbnb_plus
      }
    }
  `;
  const { data, loading, error } = useQuery(SET_QUERY, {
    variables: {
      id: query?.id,
    },
  });

  const bundle = data?.set_by_pk;
  const refetchQueries = [
    {
      query: SET_QUERY,
      variables: {
        id: query?.id,
      },
    },
  ];
  const [insertBundle, mutationOptions] = useMutation(
    gql`
      mutation insertSet($object: set_insert_input!) {
        insert_set_one(object: $object) {
          id
        }
      }
    `,
    { refetchQueries }
  );
  const [updateBundle, mutationUpdateOptions] = useMutation(
    gql`
      mutation updateBundle($id: Int!, $object: set_set_input!) {
        update_set_by_pk(pk_columns: { id: $id }, _set: $object) {
          id
        }
      }
    `,
    { refetchQueries }
  );

  const handleSubmit = async (values, actions) => {
    if (values?.id) {
      const updatedBundle = await updateBundle({
        variables: {
          id: values.id,
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
      if (updatedBundle) {
        actions.resetForm();
        return toast.success("updated bundle!");
      }
    } else {
      const newBundle = await insertBundle({
        variables: {
          object: {
            title: values?.title || "",
            description: values?.description || "",
            object_position: values?.object_position || "",
            subtitle: values?.subtitle || "",
            cover_image: values?.cover_image || "",
            category_id: values?.category_id || "",
            is_airbnb_plus: values?.is_airbnb_plus || "",
          },
        },
      });
      if (newBundle) {
        actions.resetForm();
        return toast.success("Added new bundle!");
      }
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
            <h1>Edit Bundle</h1>
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

export default editBundle;
