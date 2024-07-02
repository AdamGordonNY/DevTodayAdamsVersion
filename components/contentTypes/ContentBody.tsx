"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";

const Content = ({ onChange, body = "" }: { onChange: any; body?: string }) => {
  const { theme } = useTheme();
  const backgroundColor =
    theme === "dark"
      ? "background-color: #262935"
      : "background-color: #FFFFFF";
  const toolbarBorder =
    theme === "dark"
      ? "border-top: 1px solid #393E4F66"
      : "border-top: 1px solid #C5D0E666";
  const textColor = theme === "dark" ? "color: #F8FAFC" : "color: #393E4F";
  const scrollbar =
    theme === "dark"
      ? `::-webkit-scrollbar-thumb {
          background-color: #393e4f;
          border-radius: 14px;
        }
        ::-webkit-scrollbar-track {
          background-color: #2c3042;
          border-radius: 5px;

        }
        ::-webkit-scrollbar {
          width: 12px;
          background-color: #2c3042;
        }`
      : `::-webkit-scrollbar-thumb {
          background-color: #dee3ea;
          border-radius: 14px;
        }
        ::-webkit-scrollbar-track {
          background-color: #f8fafc;
          border-radius: 5px;

        }
        ::-webkit-scrollbar {
          width: 12px;
          background-color: #f8fafc;
        }`;

  return (
    <Editor
      id="editor_body"
      key={theme}
      apiKey="91tfu23es3ds7f3oxa0tfujm9otbwas6fvtv714eitd41uln"
      init={{
        menubar: false,
        content_style: `body {
          ${backgroundColor};
          ${textColor};
          line-height: 20px;
        }
        a { color: #11b7ff }
        p { margin-top: 10px; margin-bottom: 10px; font-size: 14px;  }
        html { ${toolbarBorder} }
        .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #808191; line-height: 20px; font-size: 14px }
        ${scrollbar}
        `,
        plugins: "lists link image preview",
        toolbar:
          "preview | bold italic underline strikethrough blockquote link image checklist bullist numlist align indent outdent",
        placeholder: "Tell your story...",
        tinycomments_mode: "embedded",
        tinycomments_author: "Author name",
        mergetags_list: [
          { value: "First.Name", title: "First Name" },
          { value: "Email", title: "Email" },
        ],
      }}
      onEditorChange={(body: string) => onChange(body)}
      value={body}
    />
  );
};

export default Content;
