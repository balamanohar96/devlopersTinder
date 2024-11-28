const mongoose = require("mongoose");

const connectionsModelSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"user"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"user"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: "{VALUE} is not valid status type. pls check",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionsModelSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionModel = mongoose.model(
  "connectionRequest",
  connectionsModelSchema
);

module.exports = ConnectionModel;
