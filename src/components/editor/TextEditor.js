import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/textile/textile";

const TextEditor = (props) => {
  const textEditorRef = useRef();

  useEffect(() => {
    console.log("useEFFECT");
    async function init() {
      const cm = Codemirror.fromTextArea(textEditorRef.current, {
        mode: { name: "textile", json: true },
        theme: "dracula",
        lineNumbers: true,
      });

      if (props.fullHeight) {
        cm.setSize(null, "90vh");
      }
      else{
        cm.setSize(null, "45vh");
      }
    }

    init();
  }, []);

  return <textarea id={`${props.id}`} ref={textEditorRef} />;
};

export default TextEditor;
