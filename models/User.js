import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      trim: true,
      maxlength: 25,
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      trim: true,
      maxlength: 25,
    },
    email: {
      type: String,
      unique: [true, "Email address already taken"],
      match: [
        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        "Please provide a valid email address",
      ],
      required: [true, "Please provide an email address"],
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        default: null,
      },
    ],
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
  },
  {
    methods: {
      isPasswordCorrect(password) {
        return bcrypt.compareSync(password, this.password);
      },

      generateJWT() {
        return jwt.sign(
          { userId: this._id, firstName: this.firstName },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFESPAN,
          }
        );
      },
    },
  }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1)
  this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1)
});

export default mongoose.model("User", UserSchema);
