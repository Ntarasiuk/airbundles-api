import _ from "lodash";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import EditorHtml from "./EditorHtml";

const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => <p>loading Editor...</p>,
  ssr: false,
});

const Editor = ({ initialHtml, editable = false, name, formik }) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [state, setState] = useState(null);
  const uuid = `editor-${Math.floor(Math.random(34) * 100)}`;
  useEffect(() => {
    if (typeof window !== "undefined") setIsLayoutReady(true);
  }, []);

  if (!isLayoutReady) return "loading editor...";
  const id = name?.replace(/[^\w\s]/gi, "");

  const handleDataChange = () => {
    if (isLayoutReady && typeof window !== "undefined") {
      formik.setFieldValue(
        name,
        window?.document.querySelector(`#${id} .ql-editor`).innerHTML
      );
    }
  };
  return (
    <div key={name} id={id} style={{ width: "100%" }}>
      {editable && isLayoutReady ? (
        <>
          <ReactQuill
            theme="snow"
            defaultValue={_.get(formik?.values, name)}
            onChange={(data) => setState(name, data)}
            onBlur={handleDataChange}
          />
        </>
      ) : (
        <EditorHtml initialHtml={initialHtml} />
      )}
    </div>
  );
};

export default Editor;
