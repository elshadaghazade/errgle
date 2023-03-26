"use strict";
module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema(
    {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      encryptedPassword: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: "user",
        enum: ["admin", "user"],
        required: true,
      },
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );
  const User = mongoose.model("User", newSchema);
  return User;
};
