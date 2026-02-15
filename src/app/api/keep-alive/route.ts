import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const generateRandomString = (sizeInBytes: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < sizeInBytes; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export async function POST() {
  try {
    const fileSizeInBytes = 1024;
    const randomText = generateRandomString(fileSizeInBytes);
    const fileName = `keep-alive-${Date.now()}.txt`;

    const { data, error } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_TEXT_BUCKET!)
      .upload(`keep-alive/${fileName}`, randomText, {
        contentType: "text/plain",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { msg: "Failed to upload file to Supabase", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ msg: "Keep-alive file uploaded successfully", path: data.path });
  } catch (err) {
    console.error("Server error in keep-alive endpoint:", err);
    return NextResponse.json({ msg: "Server Error" }, { status: 500 });
  }
}
