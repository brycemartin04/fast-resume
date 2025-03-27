import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    portfolio: {
      slug: { type: String, unique: true },
      name: { type: String },
      title: { type: String },
      bio: { type: String },
      image: { type: String },
      skills: [{ type: String }],
      education: [
        {
          school: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          description: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      projects: [{ type: String }],
      socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        website: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
