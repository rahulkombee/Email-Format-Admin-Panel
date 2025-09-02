import React, { useEffect, useState } from "react";
import $ from "../setUpSummernotes";
import axios from "axios";

const EmailEditor: React.FC = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    // --- CHANGE 1: Define a reusable config for the editors ---
    // This avoids repeating code and makes it easier to manage.
    const summernoteConfig = {
      height: 150, // A smaller default height for header/footer
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
          // IMPORTANT: 'this' refers to the specific editor that triggered the upload
          const editor = $(this); 
          const formData = new FormData();
          formData.append("image", files[0]);

          axios
            .post("http://localhost:5000/api/upload-image", formData)
            .then((res) => {
              // This will correctly insert the image into the right editor (header, body, or footer)
              (editor as any).summernote("insertImage", res.data.url);
            })
            .catch((err) => console.error(err));
        },
      },
    };

    // --- CHANGE 2: Initialize Summernote on each unique ID ---
    ($('#header-editor') as any).summernote({ ...summernoteConfig, placeholder: "Design your header here..." });
    ($('#body-editor') as any).summernote({ ...summernoteConfig, height: 300, placeholder: "Write your main email content here..." });
    ($('#footer-editor') as any).summernote({ ...summernoteConfig, placeholder: "Design your footer here..." });

    // You can even pre-populate the footer with default content
    ($('#footer-editor') as any).summernote('code', '<p style="text-align: center;">Copyright © 2025 Admin Panel MERN - Loyalty Program. All Rights Reserved</p>');

    return () => {
      // --- CHANGE 3: Destroy all editor instances on cleanup ---
      ($('#header-editor') as any).summernote("destroy");
      ($('#body-editor') as any).summernote("destroy");
      ($('#footer-editor') as any).summernote("destroy");
    };
  }, []);

  const handleSend = async () => {
    // --- CHANGE 4: Get content from each editor and combine them ---
    const headerContent = ($("#header-editor") as any).summernote("code");
    const bodyContent = ($("#body-editor") as any).summernote("code");
    const footerContent = ($("#footer-editor") as any).summernote("code");

    // Combine them in the desired order
    const finalHtmlContent = headerContent + bodyContent + footerContent;

    try {
      // Send the combined HTML to your backend
      await axios.post(
        "http://localhost:5000/api/send-email",
        {
          to,
          subject,
          html: finalHtmlContent, // Use the combined content
        },
        {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
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

      {/* --- CHANGE 5: Use unique IDs for each editor's div --- */}
      <label className="form-label fw-bold">Header</label>
      <div id="header-editor"></div>

      <label className="form-label fw-bold mt-3">Body</label>
      <div id="body-editor"></div>

      <label className="form-label fw-bold mt-3">Footer</label>
      <div id="footer-editor"></div>

      <button className="btn btn-primary mt-3" onClick={handleSend}>
        Send Email
      </button>
    </div>
  );
};

export default EmailEditor;