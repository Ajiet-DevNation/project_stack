import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  console.log("DEBUG SESSION:", session);
  return new Response(JSON.stringify(session), { status: 200 });
}
