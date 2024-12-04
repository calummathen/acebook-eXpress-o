import React, { useState } from "react";

export const ImageForm = () => {
  const [file, setFile] = useState();

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:3000/files/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};
