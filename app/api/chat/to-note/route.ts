import { NextResponse } from "next/server";

async function notImplemented() {
  return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
}

export { notImplemented as GET, notImplemented as POST, notImplemented as PUT, notImplemented as PATCH, notImplemented as DELETE, notImplemented as OPTIONS };