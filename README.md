# ✈️ VoyaGenie – AI-Powered Travel Itinerary Planner

VoyaGenie is a smart travel assistant that takes one simple input from the user — like "Goa, 3 people, next weekend" — and generates a complete travel itinerary. It includes flights, hotels, places to visit, local food, and experiences, all powered by real-time data and AI.

---

## 🌟 Features

- 🧠 One-line trip planning using NLP
- ✈️ Flight suggestions (via API)
- 🏨 Hotel search with filters and booking options
- 📍 Must-visit spots and local experiences
- 🍽️ Food, culture, and adventure recommendations
- 🌦️ Real-time weather integration
- 🗺️ Interactive map view (Leaflet + OpenStreetMap)
- 💾 Save and export journey plans
- 💱 Currency & language converter
- 🖼️ Destination image gallery using Pexels API

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS, React
- **Backend:** Node.js / Express or Python (FastAPI)
- **AI/NLP:** OpenAI GPT-4o, LangChain
- **Maps & Places:** Leaflet.js, Geoapify
- **Images:** Pexels API
- **Hotels/Flights:** Amadeus API / Booking APIs
- **Weather:** OpenWeatherMap API
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- API keys for the services listed below

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd VoyaGenie
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Set up environment variables (see below)

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google Generative AI (Gemini) - Required for AI itinerary generation
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Pexels API - Required for destination images
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here

# Geoapify API - Required for map functionality
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key_here

# Exchange Rate API - Required for currency conversion
NEXT_PUBLIC_EXCHANGE_API_KEY=your_exchange_api_key_here
```

### Getting API Keys

- **Gemini API**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Pexels API**: Sign up at [Pexels API](https://www.pexels.com/api/)
- **Geoapify API**: Get your key from [Geoapify](https://www.geoapify.com/get-started-with-maps-api)
- **Exchange Rate API**: Sign up at [ExchangeRate-API](https://www.exchangerate-api.com/)

---

## 📖 Usage

1. Enter your travel destination
2. Specify departure location, dates, and number of travelers
3. Set your budget (optional)
4. Click "Generate Itinerary" to create your personalized travel plan
5. Explore flights, hotels, daily activities, food recommendations, and more
6. Export your itinerary as PDF or save it for later

---

## 🛠️ Build for Production

```bash
pnpm build
pnpm start
```

---

## 📝 Project Structure

```
VoyaGenie/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── itinerary-generator.tsx
│   ├── map-component.tsx
│   └── ui/                # UI component library
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Maps powered by [MapLibre GL](https://maplibre.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)

