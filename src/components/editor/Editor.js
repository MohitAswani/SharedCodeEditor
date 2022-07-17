import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const Editor = (props) => {
  const codeEditorRef = useRef();

  useEffect(() => {
    console.log("useEFFECT");
    async function init() {
      const cm = Codemirror.fromTextArea(codeEditorRef.current, {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });

      if (props.fullHeight) {
        cm.setSize(null, "100%");
      }
    }

    init();
  }, []);

  return <textarea id={`${props.id}`} ref={codeEditorRef} />;
};

export default Editor;
