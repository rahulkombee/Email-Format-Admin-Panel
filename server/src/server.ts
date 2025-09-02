import express, { Request, Response } from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "./cloudinary";
import { Readable } from "stream";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve uploaded images statically
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
//const upload = multer({ storage });

const upload = multer({ storage: multer.memoryStorage() });


interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

app.post("/api/upload-image", upload.single("image"), async (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "summernote_emails" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(req.file!.buffer); // safe because of the check above
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });

    res.json({ url: result.secure_url }); // public Cloudinary URL
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
});


// -------------------- Send Email Route --------------------
app.post("/api/send-email", async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "onoffcollection503@gmail.com",
        pass: "lhyoezzwbjjevbbn", // Use app password for Gmail
      },
    });

    await transporter.sendMail({
      from: `"Email Composer" <${"onoffcollection503@gmail.com"}>`,
      to,
      subject: subject,
      html,
    });
    console.log(subject)

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
