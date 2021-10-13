import { gql, useQuery } from "@apollo/client";
import { Button, Checkbox, Grid, Input, Select, Text } from "@geist-ui/react";
import React from "react";
import Editor from "./Editor";

function BundleForm({ formik, mutationOptions }) {
  const { data, error, loading } = useQuery(gql`
    query {
      category(order_by: { name: asc_nulls_last }) {
        id
        slug
        description
        name
      }
    }
  `);

  const selectedCategory = data?.category?.find(
    (e) => e?.id === formik?.values?.category_id
  );

  return (
    <Grid.Container gap={5} style={{ marginTop: 32 }}>
      <Grid xs={24}>
        {formik?.values?.category_id && (
          <div>
            <div style={{ display: "block" }}>
              <Text p b>
                {selectedCategory?.name}
              </Text>
            </div>
            <Button
              type="error-light"
              ghost
              onClick={() => formik?.setFieldValue("category_id", null)}
            >
              Clear Category
            </Button>
          </div>
        )}

        {data?.category && !formik?.values?.category_id && (
          <Select
            placeholder="Category"
            width="100%"
            name="set"
            value={formik?.values?.set}
            onChange={(value = "") => {
              formik.setFieldValue("category_id", value || "");
            }}
          >
            {(data?.category || [])?.map((cat) => (
              <>
                <Select.Option value={`${cat?.id}`}>{cat.name}</Select.Option>
              </>
            ))}
          </Select>
        )}
      </Grid>
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
          placeholder="Photo Position"
          name="object_position"
          onChange={formik.handleChange}
          value={formik?.values?.object_position || ""}
        >
          Photo Position
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
        <Checkbox
          name="is_airbnb_plus"
          checked={formik?.values?.is_airbnb_plus}
          onChange={(val) =>
            formik?.setFieldValue("is_airbnb_plus", val.target.checked)
          }
        >
          Is Airbnb Plus?
        </Checkbox>
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

      <Grid xs={24} justify="flex-end">
        <Button
          disabled={!formik?.values?.category_id}
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

export default BundleForm;
