import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = ({ setMarkup }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onChange = (state) => {
    setEditorState(state);
    setMarkup(stateToHTML(state.getCurrentContent()));
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onChange}
      toolbarClassName="dark:text-black text-black"
      wrapperClassName="rounded"
      editorClassName="border rounded px-2"
      handlePastedText={() => false}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "fontFamily",
          "list",
          "textAlign",
          "colorPicker",
          "link",
          "emoji",
          "image",
          "remove",
          "history",
        ],
        inline: {
          inDropdown: false,
          options: [
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "superscript",
            "subscript",
          ],
        },
        blockType: {
          inDropdown: true,
          options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
        },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: false },
        // image: {
        //   uploadCallback: uploadImageCallBack,
        //   alt: { present: true, mandatory: true },
        // },
      }}
    ></Editor>
  );
};

export default RichTextEditor;
