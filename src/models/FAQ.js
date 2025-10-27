import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    brandId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    uploadType: {
      type: String,
      trim: true,
      default: '',
    },
    filename: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful compound index for queries
faqSchema.index({ userId: 1, brandId: 1, date: -1 });

// Explicitly specify the collection name
export default mongoose.models.FAQ || mongoose.model('FAQ', faqSchema, 'faqs');