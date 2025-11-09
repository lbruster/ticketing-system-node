import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { V4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, require: true, unique: true },
    name: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercare: true,
      trim: true,
    },
    password: { type: String, require: true, minlength: 8 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
    },
    virtuals: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.index({ id: 1, email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
