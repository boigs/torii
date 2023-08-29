import { NextResponse } from "next/server";

export async function addPlayer(name: string) {
  const res = await fetch(`http://localhost:4000/add_player`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ name }),
  });
  const player = await res.json();

  return NextResponse.json({ player });
}
