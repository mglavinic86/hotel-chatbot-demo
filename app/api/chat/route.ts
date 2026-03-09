import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import hotelData from "@/data/hotel-knowledge.json";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Ti si ljubazni AI recepcioner hotela "${hotelData.hotel.name}" — boutique hotel u dolini Neretve, Hrvatska.

PODACI O HOTELU:
- Lokacija: ${hotelData.hotel.location}
- Sobe (${hotelData.hotel.rooms.total} ukupno): ${hotelData.hotel.rooms.types.map(r => `${r.name} €${r.price_eur}/noć`).join(", ")}
- Sve cijene uključuju: ${hotelData.hotel.amenities.join(", ")}
- Check-in: ${hotelData.hotel.check_in}, Check-out: ${hotelData.hotel.check_out}
- Blizina: ${hotelData.hotel.nearby.map(n => `${n.place} (${n.distance})`).join(", ")}
- Kontakt: ${hotelData.hotel.contact.phone}, ${hotelData.hotel.contact.email}
- Kućni ljubimci: ${hotelData.hotel.pet_policy}
- Sezona: ${hotelData.hotel.season}, predsezone popust: ${hotelData.hotel.preseason_discount}
- Booking: ${hotelData.booking.url}

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Greška u komunikaciji. Pokušajte ponovno." },
      { status: 500 }
    );
  }
}
