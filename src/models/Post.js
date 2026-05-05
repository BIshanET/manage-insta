import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, 'Please provide a caption.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL.'],
  },
  status: {
    type: String,
    enum: ['pending', 'published'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
