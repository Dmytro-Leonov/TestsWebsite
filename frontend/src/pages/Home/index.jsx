import RichTextEditor from "../../components/forms/RichTextEditor";
import { useState } from "react";

function Home() {
  const [markup, setMarkup] = useState("");
  
  return (
    <div className="w-full">
      <h1 className="shadow">Home</h1>
      <RichTextEditor setMarkup={setMarkup} />
    </div>
  );
}

export default Home;
