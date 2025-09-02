// import { Router } from "express";
// import { sendEmail } from "../utils/mailer";

// const router = Router();

// // Save or Send email
// router.post("/send", async (req, res) => {
  //   const { to, subject, html } = req.body;

//   try {
//     await sendEmail(to, subject, html);
//     res.json({ success: true, message: "Email sent successfully!" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Failed to send email", error });
//   }
// });

// export default router;

import express from "express";
import { uploadImage, sendEmail } from "../controllers/emailController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/send-email", sendEmail);

export default router;
