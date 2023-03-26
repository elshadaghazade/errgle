"use strict";
module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema(
    {
      unique: {
        type: String,
        required: true,
      },
      site_icon: {
        type: String,
      },
      site_name: {
        type: String,
        required: true
      },
      site_url: {
        type: String,
        required: true,
      },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  const Sites = mongoose.model("Sites", newSchema);
  return Sites;
};
