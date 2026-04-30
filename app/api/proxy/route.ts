// app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import Papa from "papaparse";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const feedUrl = searchParams.get("url");

  if (!feedUrl) return NextResponse.json({ error: "URL requerida" }, { status: 400 });

  try {
    const response = await fetch(feedUrl);
    const text = await response.text();

    let data;
    if (feedUrl.endsWith(".xml") || text.trim().startsWith("<")) {
      const parser = new XMLParser({ ignoreAttributes: false });
      const jsonObj = parser.parse(text);
      // Channable suele envolver todo en <items><item>...</item></items>
      data = jsonObj.items?.item || jsonObj.rss?.channel?.item || jsonObj;
    } else {
      const parsedCsv = Papa.parse(text, { header: true, skipEmptyLines: true });
      data = parsedCsv.data;
    }

    return NextResponse.json(Array.isArray(data) ? data : [data]);
  } catch (error) {
    return NextResponse.json({ error: "Error procesando el feed" }, { status: 500 });
  }
}
