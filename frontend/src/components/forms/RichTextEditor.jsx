import { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { toast } from "react-toastify";
import axios from "axios";

const RichTextEditor = ({ initialState, setState }) => {
  const [editorState, setEditorState] = useState(initialState);

  useEffect(() => {
    setEditorState(initialState);
  }, [initialState]);

  const onChange = (state) => {
    setEditorState(state);
    setState(state);
  };

  const uploadImageCallBack = async (file) => {
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await axios.post("https://api.imgur.com/3/image", data, {
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`,
        },
      });
      const json = await response.json();
      return json;
    } catch (error) {
      toast.error("Error uploading image");
    }
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onChange}
      toolbarClassName="dark:text-black text-black"
      wrapperClassName="rounded"
      editorClassName="border rounded px-2 unset"
      handlePastedText={() => false}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "emoji",
          "image",
          "remove",
          "history",
        ],
        inline: {
          inDropdown: false,
          options: ["bold", "italic", "underline", "strikethrough"],
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
