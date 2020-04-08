const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    title: String,
    image: String,
    document: String,
    description: String,
  },
  { timestamps: {} }
);

module.exports = mongoose.model("post", postSchema);
