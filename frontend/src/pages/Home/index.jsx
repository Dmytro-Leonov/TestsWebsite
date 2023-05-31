import RichTextEditor from "../../components/forms/RichTextEditor";
import { useState } from "react";

function Home() {
  const [markup, setMarkup] = useState('<p>assdfdddddsadfdfa</p>');
  
  
  return (
    <div className="w-full">
      <h1>Home</h1>
      <RichTextEditor setMarkup={setMarkup} initialHTML={markup} />
    </div>
  );
}

export default Home;
