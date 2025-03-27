import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Debug - Session:", session?.user?.email);

    await connectDB();
    console.log("Debug - Connected to DB");

    // Get all users
    const allUsers = await User.find({});
    console.log("Debug - All users:", JSON.stringify(allUsers, null, 2));

    // Get current user
    const currentUser = session?.user?.email
      ? await User.findOne({ email: session.user.email })
      : null;
    console.log("Debug - Current user:", currentUser ? "Found" : "Not found");
    if (currentUser) {
      console.log(
        "Debug - Current user portfolio:",
        JSON.stringify(currentUser.portfolio, null, 2)
      );
    }

    return new Response(
      JSON.stringify({
        allUsers,
        currentUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Debug - Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
