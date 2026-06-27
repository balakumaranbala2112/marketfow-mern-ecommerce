import mongoose from "mongoose";

const { Schema } = mongoose;

const webhookEventSchema = new Schema(
  {
    provider: {
      type: String,
      required: [true, "Webhook provider is required"],
      enum: ["razorpay"],
    },

    eventId: {
      type: String,
      required: [true, "Webhook event id is required"],
      trim: true,
    },

    eventType: {
      type: String,
      required: [true, "Webhook event type is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["processed", "ignored", "failed"],
      default: "processed",
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    providerOrderId: {
      type: String,
      trim: true,
      default: "",
    },

    providerPaymentId: {
      type: String,
      trim: true,
      default: "",
    },

    errorMessage: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

webhookEventSchema.index(
  {
    provider: 1,
    eventId: 1,
  },
  {
    unique: true,
  },
);

webhookEventSchema.index({
  providerOrderId: 1,
  createdAt: -1,
});

const WebhookEvent = mongoose.model("WebhookEvent", webhookEventSchema);

export default WebhookEvent;
