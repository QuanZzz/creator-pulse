import { NextResponse } from "next/server";
import { creators } from "@/lib/mock-data";

export async function GET() {
    return NextResponse.json(creators);
}
