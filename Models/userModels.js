import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    watchlist: [
      {
        id: { type: String, required: true }, // e.g., movie or show ID
        title: { type: String, required: true }, // movie title
        poster: { type: String }, // optional: movie poster URL
        watched: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // ✅ Only hash if password was modified
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (EnteredPassword) {
  return await bcrypt.compare(EnteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
