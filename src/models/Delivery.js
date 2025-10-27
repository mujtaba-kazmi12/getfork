import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true,
      index: true,
    },
    brandId: {
      type: String,
      required: [true, 'Brand ID is required'],
      trim: true,
      index: true,
    },
    deliveryType: {
      type: [String],
      default: [],
    },
    deliveryDistance: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryArea: {
      type: String,
      trim: true,
      default: '',
    },
    orderingPlatforms: {
      type: [String],
      default: [],
    },
    typeOfOrders: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryFee: {
      type: String,
      trim: true,
      default: '',
    },
    minimumOrderAmount: {
      type: String,
      trim: true,
      default: '',
    },
    additionalCharges: {
      type: String,
      trim: true,
      default: '',
    },
    availability: {
      type: String,
      trim: true,
      default: '',
    },
    estimateDeliveryTime: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryNotes: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryInquiriesPhone: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryInquiriesEmail: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
deliverySchema.index({ userId: 1, brandId: 1 });

const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);

export default Delivery;
