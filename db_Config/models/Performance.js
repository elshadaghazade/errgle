"use strict";
module.exports = (mongoose) => {
  const newSchema = new mongoose.Schema(
    {
      timing: {
        connectEnd: { type: Number },
        connectStart: { type: Number },
        loadEventEnd: { type: Number },
        domComplete: { type: Number },
        domContentLoadedEventEnd: { type: Number },
        domContentLoadedEventStart: { type: Number },
        domLoading: { type: Number },
        domainLookupEnd: { type: Number },
        domainLookupStart: { type: Number },
        fetchStart: { type: Number },
        loadEventStart: { type: Number },
        navigationStart: { type: Number },
        redirectEnd: { type: Number },
        redirectStart: { type: Number },
        requestStart: { type: Number },
        responseEnd: { type: Number },
        responseStart: { type: Number },
        secureConnectionStart: { type: Number },
        unloadEventEnd: { type: Number },
        unloadEventStart: { type: Number },
      },
      fileSize: {
        totalLoadTime: {type: Number},
        totalRequest:  {type: Number},
        files: {type: []}
      },
      origin: {
        type: String,
      },
      navigation: {
        redirectCount: { type: Number },
        type: { type: Number }
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
  const Performance = mongoose.model("Performance", newSchema);
  return Performance;
};
