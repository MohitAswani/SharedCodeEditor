import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldgutter.css";

import ACTIONS from "../../util/Actions";

const Editor = ({ fullHeight, id, socketRef, roomId, onCodeChange }) => {
  const codeEditorRef = useRef();
  const codeMirrorRef = useRef();

  useEffect(() => {
    async function init() {

      // A method of code mirror for onchange events.
      codeMirrorRef.current.on("change", (instance, changes) => {
        // Origin gives us the type of changes taking place
        const { origin } = changes;
        // getValeu on instance gives us the text in the editor.
        const code = instance.getValue();

        // Changing the code in parent component.
        onCodeChange(code);

        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });

      // codeMirrorRef.current.setValue("console.log('hello')");
    }

    init();
  }, [roomId, socketRef, onCodeChange]);

  useEffect(() => {
    async function init() {
      codeMirrorRef.current = Codemirror.fromTextArea(codeEditorRef.current, {
        mode: "javascript",
        theme: "dracula",
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

      if (fullHeight) {
        codeMirrorRef.current.setSize("100vw", "90vh");
      } else {
        codeMirrorRef.current.setSize("100vw", "45vh");
      }
    }
    init();
  }, [fullHeight]);

  const socketRefCurr = socketRef.current;

  useEffect(() => {
    if (socketRefCurr) {
      socketRefCurr.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          codeMirrorRef.current.setValue(code);
        }
      });
    }

    return () => {
      if (socketRefCurr) {
        socketRefCurr.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRefCurr]);

  return <textarea id={`${id}`} ref={codeEditorRef} />;
};

export default Editor;
