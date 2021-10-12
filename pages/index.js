import { gql, useMutation } from "@apollo/client";
import { Button, Card, Grid, Input } from "@geist-ui/react";
import axios from "axios";
import Layout from "components/Layout";
import ProductCard from "components/ProductCard";
import ProductForm from "components/ProductForm";
import { Formik } from "formik";
import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";
export default function Home() {
  const [asin, setasin] = useState("");
  const defaultValues = {
    set_id: "",
    category_id: "",
  };
  const [amazonInfo, setAmazonInfo] = useState(defaultValues);
  const getAmazonAsin = async () => {
    if (!asin) return toast.error("Add ASIN");
    const data = await axios(`/api/amazon?asin=${asin}`).then((e) => e?.data);
    setAmazonInfo(data?.results);
  };

  const [insertProduct, mutationOptions] = useMutation(gql`
    mutation insertProduct($object: product_insert_input!) {
      insert_product_one(object: $object) {
        id
      }
    }
  `);

  const handleSubmit = async (values, actions) => {
    const newProduct = await insertProduct({
      variables: {
        object: {
          title: values?.title || "",
          description: values?.description || "",
          url: values?.url || "",
          subtitle: values?.subtitle || "",
          asin: values?.asin || "",
          photo_url: values?.photo_url || "",
          cover_image: values?.cover_image || "",
          category_id: values?.category_id || "",
          set_id: values?.set_id || "",
        },
      },
    });
    if (newProduct) {
      actions.resetForm();
      setAmazonInfo(defaultValues);
      return toast.success("Added new product!");
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
            <h1>
              Welcome to the <a href="https://airbundles.com">AirBundles</a>{" "}
              Admin panel
            </h1>
            <Formik
              initialValues={amazonInfo}
              enableReinitialize
              onSubmit={(values, actions) => handleSubmit(values, actions)}
            >
              {(formik) => (
                <>
                  <Grid.Container gap={2}>
                    <Grid xs={12}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <Input
                            placeholder="ASIN"
                            onChange={(e) => setasin(e?.target?.value || "")}
                          />
                          <Button
                            style={{ marginLeft: 32 }}
                            type="secondary"
                            ghost
                            onClick={getAmazonAsin}
                          >
                            Get Amazon Info
                          </Button>
                        </div>
                        <ProductForm
                          mutationOptions={mutationOptions}
                          formik={formik}
                        />
                      </div>
                    </Grid>
                    <Grid xs={12}>
                      {formik?.values && (
                        <>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div style={{ width: 400 }}>
                              <ProductCard
                                image={
                                  formik?.values?.cover_image ||
                                  formik?.values?.photo_url
                                }
                                title={formik?.values?.title}
                                url={formik?.values?.link}
                                subtitle={formik?.values?.subtitle}
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
