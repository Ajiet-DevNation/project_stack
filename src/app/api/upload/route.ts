import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return new Response("Only image files are allowed", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Generate unique filename
    // Structure: userId/uniqueId.extension (keeps bucket organized)
    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}/${nanoid()}.${fileExt}`;

    // Upload to Supabase Storage
    // Ensure your bucket in Supabase is named 'images' and is set to Public
    const { error } = await supabaseAdmin.storage
      .from("project_images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return new Response("Upload failed", { status: 500 });
    }

    // Get the Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("project_images")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("Upload route error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}