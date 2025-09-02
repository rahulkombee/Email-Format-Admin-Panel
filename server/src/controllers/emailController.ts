import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Readable } from "stream";
import transporter from "../config/nodeMailer";
import cloudinary from "../config/cloudinary";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * @desc    Upload an image to Cloudinary
 * @route   POST /api/upload-image
 * @access  Public
 */
const uploadImage = asyncHandler(async (req: MulterRequest, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded, please provide an image.");
  }

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "summernote_emails" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(req.file!.buffer).pipe(stream);
  });

  res.status(200).json({ url: result.secure_url });
});

/**
 * @desc    Send a composed email
 * @route   POST /api/send-email
 * @access  Public
 */
const sendEmail = asyncHandler(async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    res.status(400);
    throw new Error("Missing required fields: to, subject, or html.");
  }

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ success: true, message: "Email sent successfully!" });
});

export { uploadImage, sendEmail };