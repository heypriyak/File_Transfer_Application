import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  size: Number,
  uploadTime: { type: Date, default: Date.now }
});

export default mongoose.model('File', fileSchema);
