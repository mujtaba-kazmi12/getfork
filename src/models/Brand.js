import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
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
    restaurantName: {
      type: String,
      trim: true,
      default: '',
    },
    style: {
      primaryColor: {
        type: String,
        trim: true,
        default: '',
      },
    },
    brand_fetch: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one document per brandId
brandSchema.index({ userId: 1, brandId: 1 }, { unique: true });

export default mongoose.models.Brand || mongoose.model('Brand', brandSchema);