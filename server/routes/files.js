import express from 'express';
import multer from 'multer';
import File from '../models/File.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const file = new File({
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size
  });
  await file.save();
  res.json({ message: 'File uploaded', file });
});

// List files
router.get('/', async (req, res) => {
  const files = await File.find().sort({ uploadTime: -1 });
  res.json(files);
});

// Download file
router.get('/:id/download', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
  const filePath = path.resolve('uploads', file.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on server' });
  res.download(filePath, file.originalName);
});

export default router;
