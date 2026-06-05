import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

// Helper to ensure messages file exists
async function ensureFileExists() {
  try {
    await fs.access(MESSAGES_FILE);
  } catch {
    // If file doesn't exist, create it with empty array
    await fs.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
    await fs.writeFile(
      MESSAGES_FILE,
      JSON.stringify(
        [
          {
            id: 1,
            name: "Sistem",
            message:
              "Selamat datang di Live Guestbook pitok.my.id! Silakan tinggalkan pesan Anda di sini untuk berinteraksi.",
            timestamp: new Date().toISOString(),
          },
        ],
        null,
        2,
      ),
    );
  }
}

export async function GET() {
  await ensureFileExists();
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    const data = JSON.parse(raw);
    // Return sorted messages: newest first
    const sorted = data.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await ensureFileExists();
  try {
    const body = await req.json();
    const { name, message } = body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 },
      );
    }

    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    const messages = JSON.parse(raw);

    const newMessage = {
      id: Date.now(),
      name: name.trim().slice(0, 30), // Max 30 chars for name
      message: message.trim().slice(0, 250), // Max 250 chars for safety
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    // Keep only last 100 messages to avoid large files
    const limited = messages.slice(-100);

    await fs.writeFile(MESSAGES_FILE, JSON.stringify(limited, null, 2));

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post message" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, password } = body;

    // Verify admin password
    const contentPath = path.join(process.cwd(), "data", "content.json");
    const rawContent = await fs.readFile(contentPath, "utf-8");
    const contentData = JSON.parse(rawContent);

    if (password !== contentData.admin.passwordHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawMsg = await fs.readFile(MESSAGES_FILE, "utf-8");
    const messages = JSON.parse(rawMsg);

    const filtered = messages.filter((m: any) => m.id !== id);

    await fs.writeFile(MESSAGES_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
