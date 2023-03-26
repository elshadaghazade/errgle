"use strict";
module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema(
    {
      error: {
        currentSrc: { type: String },
        tagName: { type: String },
        colno: { type: Number },
        filename: { type: String },
        lineno: { type: Number },
        message: { type: String },
      },
      cookieEnabled: {
        type: Boolean,
      },
      deviceMemory: {
        type: Number,
      },
      origin: {
        type: String,
      },
      language: {
        type: String,
      },
      count: {
        type: Number,
        default: 1,
      },
      languages: {
        type: [],
      },
      online: {
        type: Boolean,
      },
      userAgent: {
        type: String,
      },
      vendor: {
        type: String,
      },
      platform: {
        type: String,
      },
      plugins: {
        type: [],
      },
      appName: {
        type: String,
      },
      appVersion: {
        type: String,
      },
      appCodeName: {
        type: String,
      },
      is_fixed: {
        type: Boolean,
        default: false,
      },
      is_visible: {
        type: Boolean,
        default: true,
      },
      appOS: {
        type: String,
      },
      sites: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Sites",
      },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  const Errors = mongoose.model("Errors", newSchema);
  return Errors;
};
