import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Create Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on upload type
    const uploadType = req.body.type || "general";
    let folder = "noce-florale/general";
    let transformation = [{ quality: "auto:good" }, { fetch_format: "auto" }];

    switch (uploadType) {
      case "wedding":
        folder = "noce-florale/wedding-photos";
        transformation = [
          { quality: "auto:best" },
          { fetch_format: "auto" },
          { width: 1920, height: 1080, crop: "limit" },
        ];
        break;
      case "gallery":
        folder = "noce-florale/gallery";
        transformation = [
          { quality: "auto:good" },
          { fetch_format: "auto" },
          { width: 1200, height: 800, crop: "fill", gravity: "auto" },
        ];
        break;
      case "thumbnail":
        folder = "noce-florale/thumbnails";
        transformation = [
          { quality: "auto:good" },
          { fetch_format: "auto" },
          { width: 400, height: 300, crop: "fill", gravity: "auto" },
        ];
        break;
      case "rsvp":
        folder = "noce-florale/rsvp-media";
        transformation = [
          { quality: "auto:good" },
          { fetch_format: "auto" },
          { width: 800, height: 600, crop: "limit" },
        ];
        break;
    }

    return {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: transformation,
      tags: [uploadType, "noce-florale", new Date().getFullYear().toString()],
      context: {
        alt: req.body.alt || "",
        caption: req.body.caption || "",
      },
    };
  },
});

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Single file upload
router.post("/single", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = {
      success: true,
      data: {
        public_id: req.file.filename,
        secure_url: req.file.path,
        original_filename: req.file.originalname,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height,
        bytes: req.file.bytes,
        created_at: new Date().toISOString(),
      },
    };

    res.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Multiple files upload
router.post("/multiple", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = req.files.map((file) => ({
      public_id: file.filename,
      secure_url: file.path,
      original_filename: file.originalname,
      format: file.format,
      width: file.width,
      height: file.height,
      bytes: file.bytes,
    }));

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Delete image
router.delete("/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Delete failed", details: error.message });
  }
});

// Get images from folder
router.get("/folder/:folderName", async (req, res) => {
  try {
    const { folderName } = req.params;
    const { max_results = 50, next_cursor } = req.query;

    const result = await cloudinary.search
      .expression(`folder:noce-florale/${folderName}`)
      .sort_by([["created_at", "desc"]])
      .max_results(parseInt(max_results))
      .next_cursor(next_cursor)
      .execute();

    res.json({
      success: true,
      data: result.resources,
      next_cursor: result.next_cursor,
      total_count: result.total_count,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Fetch failed", details: error.message });
  }
});

export default router;
