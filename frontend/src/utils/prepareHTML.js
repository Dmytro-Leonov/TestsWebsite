const prepareHTML = (html) => {
  html = html.replace(">\n<", "><");
  if (html === "<p><br></p>") html = "";
  return html;
};

export default prepareHTML;
