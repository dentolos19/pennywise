import { NextRequest, NextResponse } from "next/server";

import lessons from "@/data/lessons.json";

export function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json(lessons, { status: 200 });

  const lesson = lessons.find((lesson) => lesson.id === id);
  if (!lesson) return new NextResponse("Not found.", { status: 404 });

  return NextResponse.json(lesson, { status: 200 });
}
