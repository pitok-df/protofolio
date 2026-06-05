import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    const data = JSON.parse(raw);

    if (password !== data.admin.passwordHash) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
