import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "fast-resume";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(dbName),
      };
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToDatabase();
    const bucket = new GridFSBucket(db, {
      bucketName: "images",
    });

    const file = await bucket.find({ _id: new ObjectId(id) }).next();
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    const chunks = [];

    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Length": file.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
