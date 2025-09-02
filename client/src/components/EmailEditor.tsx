import React, { useEffect, useState } from "react";
import $ from "../setUpSummernotes";
import axios from "axios";

const EmailEditor: React.FC = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const editor = $("#editor");

    (editor as any).summernote({
      height: 300,
      placeholder: "Write your email here...",
      styleTags: ["p", "h1", "h2", "h3"],
      toolbar: [
        ["style", ["style"]],
        ["font", ["bold", "italic", "underline", "clear"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["insert", ["link", "picture"]],
        ["view", ["fullscreen", "codeview"]],
      ],
      callbacks: {
        onImageUpload: function (files: File[]) {
          const formData = new FormData();
          formData.append("image", files[0]);
    
          axios.post("http://localhost:5000/api/upload-image", formData)
            .then(res => {
              // insert uploaded image URL into Summernote
              (editor as any).summernote('insertImage', res.data.url);
            })
            .catch(err => console.error(err));
        }
      }
    });

    return () => {
      (editor as any).summernote("destroy");
    };
  }, []);

  const handleSend = async () => {
    const content = ($("#editor") as any).summernote("code");

    try {
      await axios.post("http://localhost:5000/api/send-email", {
        to,
        subject,
        html: content,
      },{
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      alert("✅ Email sent successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send email");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Email Composer</h2>

      <div className="mb-3">
        <label className="form-label">To:</label>
        <input
          type="email"
          className="form-control"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="recipient@example.com"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Subject:</label>
        <input
          type="text"
          className="form-control"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />
      </div>

      <div id="editor"></div>

      <button className="btn btn-primary mt-3" onClick={handleSend}>
        Send Email
      </button>
    </div>
  );
};

export default EmailEditor;
