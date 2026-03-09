import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `Ti si ljubazni AI recepcioner hotela "Villa Neretvanka" — boutique hotel u dolini Neretve, Hrvatska.

PODACI O HOTELU:
- Lokacija: Neretva valley, Croatia
- Sobe (12 ukupno): Standard €80/noć, Superior €120/noć, Deluxe €160/noć, Suite €220/noć
- Sve cijene uključuju: doručak, besplatan parking, WiFi, pristup bazenu, restoran s lokalnom kuhinjom
- Check-in: 14:00, Check-out: 10:00
- Blizina: Kravice vodopadi (30 min), Mostar (45 min), Dubrovnik (1.5h), Ston (40 min)
- Kontakt: +385 20 123 456, info@villa-neretvanka.hr
- Kućni ljubimci: dozvoljeni mali psi do 10kg
- Sezona: lipanj-rujan, predsezone popust 20%
- Booking: https://villa-neretvanka.hr/booking

PRAVILA:
1. Detektiraj jezik korisnika i odgovaraj na istom jeziku (HR, EN, DE, IT)
2. Budi kratak i konkretan — max 3-4 rečenice
3. Uvijek ponudi booking link kad je relevantno
4. Ako ne znaš odgovor, reci da ćeš proslijediti recepciji
5. Budi topao i profesionalan, koristi emoji umjereno (1-2 max)
6. Za datume i dostupnost — reci da provjeriš i proslijediš recepciji za potvrdu
7. Nikad ne izmišljaj informacije koje nisu u podacima`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length > 40) {
      return NextResponse.json(
        { error: "Demo limit: maksimalno 20 poruka po sesiji." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format, skip leading assistant messages
    const allMsgs = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    
    // Gemini requires first message to be 'user' — drop leading model messages
    const firstUserIdx = allMsgs.findIndex((m: { role: string }) => m.role === "user");
    if (firstUserIdx === -1) {
      return NextResponse.json({ message: "Kako vam mogu pomoći?" });
    }
    const trimmed = allMsgs.slice(firstUserIdx);
    const history = trimmed.slice(0, -1);
    const lastMessage = trimmed[trimmed.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const response = result.response.text();

    return NextResponse.json({ message: response });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Greška: ${msg}` },
      { status: 500 }
    );
  }
}
