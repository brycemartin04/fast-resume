import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("GET request - Session:", session?.user?.email);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    console.log("GET request - Found user:", user ? "Yes" : "No");
    console.log(
      "GET request - User portfolio:",
      JSON.stringify(user?.portfolio, null, 2)
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(user.portfolio || {}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("POST request - Session:", session?.user?.email);

    if (!session?.user?.email) {
      console.error("POST request - No session found");
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    console.log("POST request - Received data:", JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.slug || !data.name) {
      console.error("POST request - Missing required fields:", {
        slug: data.slug,
        name: data.name,
      });
      return new Response(
        JSON.stringify({ error: "Slug and name are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await connectDB();
    console.log("POST request - Connected to DB");

    // First, find the existing user
    const existingUser = await User.findOne({ email: session.user.email });
    console.log(
      "POST request - Existing user:",
      existingUser ? "Found" : "Not found"
    );

    // Check if slug is already taken by another user
    if (data.slug) {
      const slugUser = await User.findOne({
        "portfolio.slug": data.slug,
        email: { $ne: session.user.email },
      });
      console.log(
        "POST request - Slug check:",
        slugUser ? "Taken" : "Available"
      );

      if (slugUser) {
        return new Response(
          JSON.stringify({ error: "This URL is already taken" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Prepare portfolio data
    const portfolioData = {
      ...data,
      skills: data.skills || [],
      education: data.education || [],
      experience: data.experience || [],
      projects: data.projects || [],
      socialLinks: data.socialLinks || {
        github: "",
        linkedin: "",
        twitter: "",
        website: "",
      },
    };

    console.log(
      "POST request - Prepared portfolio data:",
      JSON.stringify(portfolioData, null, 2)
    );

    // Update or create user with portfolio data
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          portfolio: portfolioData,
          name: session.user.name,
          image: session.user.image,
        },
      },
      { new: true, upsert: true }
    );

    if (!user) {
      console.error("POST request - Failed to update user");
      return new Response(JSON.stringify({ error: "Failed to update user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("POST request - Updated user:", user ? "Yes" : "No");
    console.log(
      "POST request - Updated portfolio:",
      JSON.stringify(user?.portfolio, null, 2)
    );

    // Verify the update
    const verifyUser = await User.findOne({ email: session.user.email });
    console.log(
      "POST request - Verification - User found:",
      verifyUser ? "Yes" : "No"
    );
    console.log(
      "POST request - Verification - Portfolio:",
      JSON.stringify(verifyUser?.portfolio, null, 2)
    );

    return new Response(JSON.stringify(user.portfolio), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    console.error("Error stack:", error.stack);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
