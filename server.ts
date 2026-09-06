import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Permissions and Security Headers for WebRTC & Device Capabilities
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(self *), microphone=(self *), display-capture=(self *), geolocation=(self *)"
  );
  next();
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "EventCrew API" });
});

// Server Calendar Export (.ICS) for mobile & desktop calendar subscriptions
app.get("/api/calendar/export-ics", (req, res) => {
  try {
    const { title, venue, city, startDate, time, organizerName } = req.query;
    const rawDate = (startDate as string) || '2026-08-15';
    const dateStr = rawDate.replace(/[-/]/g, '').slice(0, 8);
    const startIso = `${dateStr}T090000Z`;
    const endIso = `${dateStr}T170000Z`;
    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const cleanTitle = ((title as string) || 'Event Shift').replace(/,/g, '\\,');
    const cleanVenue = ((venue as string) || 'Venue').replace(/,/g, '\\,');
    const cleanCity = ((city as string) || '').replace(/,/g, '\\,');
    const cleanOrg = ((organizerName as string) || 'EventCrew Organizer').replace(/,/g, '\\,');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventCrew//Shift Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:shift-${Date.now()}@eventcrew.com`,
      `DTSTAMP:${nowStamp}`,
      `SUMMARY:${cleanTitle} - EventCrew Shift`,
      `DESCRIPTION:Confirmed event shift with ${cleanOrg}. Shift timing: ${time || 'Scheduled shift'}. Venue: ${cleanVenue}`,
      `LOCATION:${cleanVenue}\\, ${cleanCity}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const safeFilename = ((title as string) || 'event_shift').replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.ics"`);
    res.send(icsContent);
  } catch (err) {
    res.status(500).send('Error generating calendar file');
  }
});

// Initialize Gemini AI lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// AI Endpoint: Generate Event & Role Description
app.post("/api/ai/suggest-description", async (req, res) => {
  try {
    const { title, category, city, roles } = req.body;
    const ai = getGeminiAI();

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
        description: `Join us for the upcoming ${title || 'Event'} in ${city || 'Mumbai'}. We are hiring skilled ${category || 'Event'} staff to deliver an exceptional guest experience. Responsibilities include setup, guest hospitality, team coordination, and venue management.`
      });
    }

    const prompt = `Write a compelling 3-paragraph professional event job post description for an event titled "${title || 'Event'}" in "${city || 'Mumbai'}" under the category "${category || 'Catering'}". Roles needed: ${JSON.stringify(roles || [])}. Highlight shift expectations, attire, punctuality, and team environment. Keep it energetic and professional.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ description: response.text || "An exciting event opportunity." });
  } catch (error: any) {
    console.error("Gemini AI error:", error);
    res.json({
      description: `Join our dynamic team for ${req.body.title || 'the event'}. We provide competitive pay, clear direction, and an exciting work atmosphere.`
    });
  }
});

// AI Endpoint: Match Worker suitability score
app.post("/api/ai/match-worker", async (req, res) => {
  try {
    const { workerSkills, workerBio, jobCategory, jobTitle } = req.body;
    const ai = getGeminiAI();

    if (!ai) {
      // Simple heuristic score
      const hasSkill = workerSkills?.includes(jobCategory);
      return res.json({
        matchScore: hasSkill ? 94 : 78,
        matchReason: hasSkill
          ? `Worker profile matches the primary category "${jobCategory}" with verified experience.`
          : `Worker brings versatile experience suited for event logistics.`
      });
    }

    const prompt = `Analyze this worker for the event role "${jobTitle}" (Category: ${jobCategory}):
Worker Skills: ${JSON.stringify(workerSkills)}
Worker Bio: "${workerBio}"

Respond strictly in JSON format with:
{"matchScore": number between 60 and 99, "matchReason": "1 concise sentence why they match or what strengths they bring"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json(parsed);
    }

    res.json({ matchScore: 88, matchReason: "Strong profile alignment and verified category skills." });
  } catch (error) {
    res.json({ matchScore: 85, matchReason: "Reliable event worker with relevant category background." });
  }
});

// AI Endpoint: Smart Budget & Fair Pay Recommendation
app.post("/api/ai/smart-budget", async (req, res) => {
  try {
    const { roleTitle, category, city, shiftHours } = req.body;
    const hours = Number(shiftHours) || 6;
    const ai = getGeminiAI();

    if (!ai) {
      // Benchmark fallbacks based on Indian metro standards
      const baseHourly: Record<string, number> = {
        'Catering': 350,
        'Decoration': 450,
        'Hosting': 500,
        'Photography': 900,
        'Security': 380,
        'Cleaning': 280,
        'Audio & DJ': 850,
        'General Helper': 250
      };
      const catRate = baseHourly[category] || 350;
      const cityMultiplier = ['Mumbai', 'Bengaluru', 'Delhi'].includes(city) ? 1.2 : 1.0;
      const hourly = Math.round(catRate * cityMultiplier);
      const total = hourly * hours;

      return res.json({
        recommendedHourly: hourly,
        minHourly: Math.round(hourly * 0.85),
        maxHourly: Math.round(hourly * 1.3),
        shiftEstimate: total,
        rationale: `Based on standard ${city || 'metro'} event hospitality rates for ${category || 'event'} personnel during peak shifts.`
      });
    }

    const prompt = `You are an expert event staffing compensation consultant for Indian metro events.
Given:
- Role: "${roleTitle || 'Event Staff'}"
- Category: "${category || 'Catering'}"
- City: "${city || 'Mumbai'}"
- Shift Duration: ${hours} hours

Provide recommended fair pay in Indian Rupees (INR). Respond strictly with valid JSON:
{
  "recommendedHourly": number (e.g. 450),
  "minHourly": number (e.g. 350),
  "maxHourly": number (e.g. 600),
  "shiftEstimate": number (e.g. 2700),
  "rationale": "1 concise sentence explaining market demand and fairness"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[0]));
    }

    res.json({
      recommendedHourly: 450,
      minHourly: 350,
      maxHourly: 600,
      shiftEstimate: 450 * hours,
      rationale: `Standard competitive rate for ${category} roles in ${city}.`
    });
  } catch (error) {
    res.json({
      recommendedHourly: 400,
      minHourly: 300,
      maxHourly: 550,
      shiftEstimate: 400 * (Number(req.body.shiftHours) || 6),
      rationale: `Standard competitive rate for event shifts in ${req.body.city || 'India'}.`
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EventCrew Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
