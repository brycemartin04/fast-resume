import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { connectToDatabase } from "@/app/lib/mongodb";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const { db } = await connectToDatabase();

  // Find existing user
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  // Convert MongoDB ObjectId to string and prepare user data
  const userData = user
    ? {
        _id: user._id.toString(), // Convert ObjectId to string
        name: user.name,
        email: user.email,
        image: user.image,
        portfolio: user.portfolio
          ? {
              ...user.portfolio,
              experience: user.portfolio.experience.map((exp) => ({
                ...exp,
                _id: exp._id.toString(), // Convert ObjectId to string
              })),
              education: user.portfolio.education.map((edu) => ({
                ...edu,
                _id: edu._id.toString(), // Convert ObjectId to string
              })),
            }
          : {
              useGradient: false,
              backgroundColor: "#4F46E5",
              gradientStart: "#4F46E5",
              gradientEnd: "#7C3AED",
              skills: [],
              education: [],
              experience: [],
              socialLinks: {
                github: "",
                linkedin: "",
                twitter: "",
                website: "",
              },
            },
      }
    : {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        portfolio: {
          useGradient: false,
          backgroundColor: "#4F46E5",
          gradientStart: "#4F46E5",
          gradientEnd: "#7C3AED",
          skills: [],
          education: [],
          experience: [],
          socialLinks: {
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
          },
        },
      };

  // If user doesn't exist, create them
  if (!user) {
    await db.collection("users").insertOne(userData);
  }

  return <DashboardClient user={userData} />;
}
