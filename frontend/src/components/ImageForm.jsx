import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const ImageForm = () => {
  const [file, setFile] = useState();

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BACKEND_URL}/files/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
  };
  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};
