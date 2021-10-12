import React from "react";

function EditorHtml({ initialHtml }) {
  const classes = useStyles();

  return (
    <div
      className={classes.html}
      dangerouslySetInnerHTML={{ __html: initialHtml }}
    />
  );
}

export default EditorHtml;
