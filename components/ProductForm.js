import { gql, useQuery } from "@apollo/client";
import { Button, Grid, Input, Select, Text } from "@geist-ui/react";
import React from "react";
import Editor from "./Editor";

function ProductForm({ formik, mutationOptions }) {
  const { data, error, loading } = useQuery(gql`
    query {
      category {
        id
        slug
        description
        name
        sets {
          id
          cover_image
          description
          subtitle
          title
          is_airbnb_plus
        }
      }
    }
  `);

  const selectedCategory = data?.category?.find(
    (e) => e?.id === formik?.values?.category_id
  );
  const selectedSet =
    selectedCategory?.sets.find(({ id }) => id == formik?.values?.set_id) ||
    null;
  return (
    <Grid.Container gap={5} style={{ marginTop: 32 }}>
      <Grid xs={24}>
        <Input
          width="100%"
          placeholder="Title"
          name="title"
          onChange={formik.handleChange}
          value={formik?.values?.title || ""}
        >
          Title
        </Input>
      </Grid>
      <Grid xs={24}>
        <Input
          width="100%"
          placeholder="Subtitle"
          name="subtitle"
          onChange={formik.handleChange}
          value={formik?.values?.subtitle || ""}
        >
          Subtitle
        </Input>
      </Grid>
      <Grid xs={24}>
        <Input
          width="100%"
          placeholder="Description"
          name="description"
          onChange={formik.handleChange}
          value={formik?.values?.description || ""}
        >
          Description
        </Input>
      </Grid>
      <Grid xs={24}>
        <Editor
          editable
          placeholder="Description HTML"
          initialHtml={formik?.values?.description}
          formik={formik}
          name={`description`}
        />
      </Grid>
      <Grid xs={24}>
        <Input
          width="100%"
          placeholder="Image"
          name="image"
          onChange={formik.handleChange}
          value={formik?.values?.photo_url || ""}
        >
          Image
        </Input>
      </Grid>
      <Grid xs={24}>
        <Input
          width="100%"
          placeholder="Cover Image (optional)"
          name="cover_image"
          onChange={formik.handleChange}
          value={formik?.values?.cover_image || ""}
        >
          Cover Photo (optional)
        </Input>
      </Grid>
      <Grid xs={24}>
        <Input
          width="100%"
          placeholder="ASIN"
          name="asin"
          onChange={formik.handleChange}
          value={formik?.values?.asin || ""}
        >
          ASIN
        </Input>
      </Grid>
      <Grid xs={24}>
        {formik?.values?.set_id && (
          <div>
            <div style={{ display: "block" }}>
              <Text p b>
                {selectedCategory?.name}
              </Text>
              <Text p>{selectedSet?.title}</Text>
            </div>
            <Button
              type="error-light"
              ghost
              onClick={() => formik?.setFieldValue("set_id", null)}
            >
              Clear Set
            </Button>
          </div>
        )}

        {data?.category && !formik?.values?.set_id && (
          <Select
            placeholder="Set"
            width="100%"
            name="set"
            value={formik?.values?.set}
            onChange={(value = "") => {
              formik.setFieldValue("category_id", value?.split("|")?.[0] || "");
              formik.setFieldValue("set_id", value?.split("|")?.[1] || "");
            }}
          >
            {(data?.category || [])?.map((cat) => (
              <>
                <Select.Option label>{cat.name}</Select.Option>
                {cat?.sets.map((set) => (
                  <Select.Option value={`${cat?.id}|${set?.id}`}>
                    {set?.title}
                  </Select.Option>
                ))}
              </>
            ))}
          </Select>
        )}
      </Grid>
      <Grid xs={24} justify="flex-end">
        <Button
          disabled={!formik?.values?.set_id}
          loading={mutationOptions?.loading}
          type="success"
          htmlType="submit"
          onClick={formik.submitForm}
        >
          Submit
        </Button>
      </Grid>
    </Grid.Container>
  );
}

export default ProductForm;
