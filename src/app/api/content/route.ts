import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    const data = JSON.parse(raw);
    // Don't expose admin password
    const { admin: _admin, ...safe } = data;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json(
      { error: "Failed to read content" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, ...updates } = body;

    // Read existing content
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    const existing = JSON.parse(raw);

    // Verify password
    if (password !== existing.admin.passwordHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Merge updates (preserve admin config)
    const updated = {
      ...existing,
      ...updates,
      admin: existing.admin, // always keep admin config
    };

    await fs.writeFile(CONTENT_PATH, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}
