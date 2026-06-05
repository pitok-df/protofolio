import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

const TOPICS_FILE = path.join(process.cwd(), "data", "topics.json");

async function ensureFileExists() {
  try {
    await fs.access(TOPICS_FILE);
  } catch {
    await fs.mkdir(path.dirname(TOPICS_FILE), { recursive: true });
    await fs.writeFile(TOPICS_FILE, JSON.stringify([], null, 2));
  }
}

export async function GET() {
  await ensureFileExists();
  try {
    const raw = await fs.readFile(TOPICS_FILE, "utf-8");
    const data = JSON.parse(raw);
    // Sort topics: newest first
    const sorted = data.sort(
      (a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read topics" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  await ensureFileExists();
  try {
    const body = await req.json();
    const { action } = body;

    const raw = await fs.readFile(TOPICS_FILE, "utf-8");
    const topics = JSON.parse(raw);

    // ACTION: CREATE TOPIC
    if (action === "create") {
      const { title, description, creator } = body;
      if (
        !title ||
        !title.trim() ||
        !description ||
        !description.trim() ||
        !creator ||
        !creator.trim()
      ) {
        return NextResponse.json(
          { error: "Title, description, and creator name are required" },
          { status: 400 },
        );
      }

      const newTopic = {
        id: Date.now(),
        title: title.trim().slice(0, 80),
        description: description.trim().slice(0, 300),
        creator: creator.trim().slice(0, 30),
        timestamp: new Date().toISOString(),
        replies: [],
      };

      topics.push(newTopic);

      // Keep maximum 50 topics
      const limited = topics.slice(-50);
      await fs.writeFile(TOPICS_FILE, JSON.stringify(limited, null, 2));
      return NextResponse.json(newTopic);
    }

    // ACTION: REPLY TO TOPIC
    else if (action === "reply") {
      const { topicId, name, message, replyTo } = body;
      if (!topicId || !name || !name.trim() || !message || !message.trim()) {
        return NextResponse.json(
          { error: "Topic ID, name, and message are required" },
          { status: 400 },
        );
      }

      const topicIndex = topics.findIndex((t: any) => t.id === Number(topicId));
      if (topicIndex === -1) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }

      const newReply = {
        id: Date.now(),
        name: name.trim().slice(0, 30),
        replyTo: replyTo ? replyTo.trim().slice(0, 30) : null,
        message: message.trim().slice(0, 200),
        timestamp: new Date().toISOString(),
      };

      topics[topicIndex].replies.push(newReply);

      // Keep max 50 replies per topic
      if (topics[topicIndex].replies.length > 50) {
        topics[topicIndex].replies = topics[topicIndex].replies.slice(-50);
      }

      await fs.writeFile(TOPICS_FILE, JSON.stringify(topics, null, 2));
      return NextResponse.json(newReply);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
