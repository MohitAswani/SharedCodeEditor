import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldgutter.css";

import classes from './CodeEditor.module.css';

const Editor = (props) => {
  const codeEditorRef = useRef();

  useEffect(() => {
    console.log("useEFFECT");
    async function init() {
      const cm = Codemirror.fromTextArea(codeEditorRef.current, {
        mode: "clike",
        theme:"dracula",
        lineWrapping: true,
        smartIndent: true,
        lineNumbers: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        autoCloseTags: true,
        keyMap: "sublime",
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
          "Ctrl-Space": "autocomplete",
        },
      });

      if (props.fullHeight) {
        cm.setSize(null, "90vh");
      }
    }

    init();
  }, []);

  return <textarea className={classes.CodeEditor} id={`${props.id}`} ref={codeEditorRef} />;
};

export default Editor;
