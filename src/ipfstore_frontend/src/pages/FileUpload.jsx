import React, { useState } from "react";
import axios from "axios";
import "./style.css"; 
import { ipfstore_backend } from 'declarations/ipfstore_backend';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append("file", file);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        fileData,
        {
          headers: {
            pinata_api_key: "8a31162c870aff19c285",
            pinata_secret_api_key:
              "64135af347d8d9532dc146bb57baea8c97c0f3f0c7a3392b1e39cc48637d9392",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Call the Motoko actor function to store the URL
      const url = await ipfstore_backend.getUrl(res.data.IpfsHash);

      alert("Successfully Image Uploaded");
      console.log(url);
      setFileUrl(url);
      setFile(null);
    } catch (error) {
      alert(error.message || "An error occurred while uploading the file.");
    }
  };

  return (
    <div className="file-upload-container">
      <h1 className="upload-heading">File Upload Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} className="file-input" />
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
      {fileUrl && (
        <div className="file-url-container">
          <h2 className="file-url-heading">Uploaded File URL:</h2>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-url">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
