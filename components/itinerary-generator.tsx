"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  // PDF export
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  DollarSign,
  Save,
  Mail,
  FileText,
  Loader2,
  Sparkles,
  Star,
  Info,
  Calendar,
  Users,
  Wallet,
} from "lucide-react";
// import { generateText } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ItineraryGeneratorProps {
  destination: string;
  travelers: { adults: number; children: number };
  travelDates: string;
  duration: string;
  dateType: string;
  budget: string;
}

interface FlightOption {
  airline: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  stops: string;
}

interface HotelRecommendation {
  name: string;
  rating: number;
  location: string;
  priceRange: string;
  amenities: string[];
  description: string;
}

interface DayActivity {
  time: string;
  activity: string;
  location: string;
  duration: string;
  cost: string;
  tips: string;
}

interface DailyItinerary {
  day: number;
  title: string;
  theme: string;
  activities: DayActivity[];
  meals: string[];
  transportation: string;
  budget: string;
}

interface FoodRecommendation {
  name: string;
  cuisine: string;
  location: string;
  priceRange: string;
  mustTry: string[];
  description: string;
  rating: number;
}

interface Experience {
  name: string;
  type: string;
  duration: string;
  difficulty: string;
  price: string;
  description: string;
  bestTime: string;
}

interface GeneratedItinerary {
  flightOptions: FlightOption[];
  hotelRecommendations: HotelRecommendation[];
  dailyItinerary: DailyItinerary[];
  foodRecommendations: FoodRecommendation[];
  experiences: Experience[];
  weatherTips: string;
  localInsights: {
    currency: string;
    language: string;
    transportation: string;
    culture: string;
    safety: string;
    shopping: string;
  };
  budgetBreakdown: {
    flights: string;
    accommodation: string;
    food: string;
    activities: string;
    transportation: string;
    miscellaneous: string;
    total: string;
  };
  packingList: string[];
  emergencyContacts: string[];
}

export default function ItineraryGenerator({
  destination,
  travelers,
  travelDates,
  duration,
  dateType,
  budget,
}: ItineraryGeneratorProps) {
  const [generatedItinerary, setGeneratedItinerary] =
    useState<GeneratedItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);

  const generateItinerary = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const prompt = `Plan a comprehensive travel itinerary for:
      
      TRIP DETAILS:
      - Destination: ${destination}
      - Travelers: ${travelers.adults} adults${
        travelers.children > 0 ? `, ${travelers.children} children` : ""
      }
      - Dates: ${dateType === "dates" ? travelDates : duration}
      - Budget: ${budget}
      - Departure City: Mumbai (default)
      
      Create a detailed JSON response with these exact sections:
      
      {
        "flightOptions": [ ... ],
        "hotelRecommendations": [ ... ],
        "dailyItinerary": [ ... ],
        "foodRecommendations": [ ... ],
        "experiences": [ ... ],
        "weatherTips": "Weather advice for the travel period",
        "localInsights": { ... },
        "budgetBreakdown": { ... },
        "packingList": [ ... ],
        "emergencyContacts": [ ... ]
      }
      
      Make it detailed, practical, and specific to ${destination}. Include real places, restaurants, and activities.`;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file."
        );
        setIsGenerating(false);
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Parse the JSON response
      let parsedItinerary;
      try {
        parsedItinerary = JSON.parse(text);
      } catch {
        parsedItinerary = null;
      }
      setGeneratedItinerary(parsedItinerary);
    } catch (error) {
      console.error("Itinerary generation error:", error);
      setError("Unable to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportItinerary = async (format: "pdf" | "email" | "save") => {
    if (!generatedItinerary) return;
    const itineraryText = JSON.stringify(generatedItinerary, null, 2);
    if (format === "pdf") {
      // Dynamically import jsPDF for PDF export
      try {
        const jsPDFModule = await import("jspdf");
        const jsPDF = jsPDFModule.default;
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(itineraryText, 180);
        doc.setFontSize(10);
        doc.text(lines, 10, 10);
        doc.save("itinerary.pdf");
      } catch (e) {
        alert(
          "PDF export failed. Please ensure jsPDF is installed (npm install jspdf)."
        );
      }
    } else if (format === "email") {
      // Open mailto with itinerary in body
      const subject = encodeURIComponent("Your Travel Itinerary");
      const body = encodeURIComponent(itineraryText);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } else if (format === "save") {
      // Save as .txt file
      const blob = new Blob([itineraryText], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "itinerary.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowExportDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={generateItinerary}
          disabled={isGenerating}
          className="px-12 py-6 text-xl rounded-3xl shadow-2xl text-white font-bold"
          style={{
            background: isGenerating
              ? "linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%)"
              : "linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #FF5722 100%)",
            boxShadow: "0 12px 40px rgba(255, 87, 34, 0.4)",
          }}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-8 w-8 mr-4 animate-spin" />
              Crafting Your Perfect Journey...
            </>
          ) : (
            <>
              <Sparkles className="h-8 w-8 mr-4" />
              Generate Complete Itinerary
            </>
          )}
        </Button>

        {error && (
          <p className="text-red-600 mt-4 text-lg font-semibold">⚠️ {error}</p>
        )}
      </div>

      {/* Generated Itinerary Display */}
      {generatedItinerary && (
        <div className="space-y-8">
          {/* Header */}
          <Card
            className="rounded-3xl shadow-2xl border-0"
            style={{
              background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
              boxShadow: "0 20px 60px rgba(255, 152, 0, 0.3)",
            }}
          >
            <CardHeader className="text-center py-8">
              <CardTitle className="text-4xl font-bold text-white mb-4">
                ✨ Your Perfect {destination} Adventure
              </CardTitle>
              <div className="flex justify-center items-center gap-6 text-orange-100 text-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {travelers.adults + travelers.children} traveler
                  {travelers.adults + travelers.children !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {dateType === "dates" ? travelDates : duration}
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {budget}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Export Options */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowExportDialog(true)}
              className="rounded-full bg-white text-orange-600 border-2 border-orange-300 hover:bg-orange-50 font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              Export Itinerary
            </Button>
          </div>

          {/* Itinerary Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 rounded-2xl p-2 bg-gradient-to-r from-orange-400 to-red-400">
              <TabsTrigger
                value="overview"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                📋 Overview
              </TabsTrigger>
              <TabsTrigger
                value="flights"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                ✈️ Flights
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🏨 Hotels
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                📅 Daily Plan
              </TabsTrigger>
              <TabsTrigger
                value="food"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🍽️ Food
              </TabsTrigger>
              <TabsTrigger
                value="tips"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                💡 Tips
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Budget Breakdown */}
                <Card className="rounded-3xl shadow-xl border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Budget Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(generatedItinerary.budgetBreakdown).map(
                        ([category, amount]) => (
                          <div
                            key={category}
                            className="flex justify-between items-center py-2 border-b border-orange-100"
                          >
                            <span className="capitalize text-amber-800 font-medium">
                              {category}
                            </span>
                            <span className="font-bold text-orange-600">
                              {amount}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Tips */}
                <Card className="rounded-3xl shadow-xl border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                      🌤️ Weather & Packing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-800 mb-4">
                      {generatedItinerary.weatherTips}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-900">
                        Packing Essentials:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedItinerary.packingList.map((item, index) => (
                          <Badge
                            key={index}
                            className="bg-orange-100 text-orange-800"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Flights Tab */}
            <TabsContent value="flights">
              <div className="grid gap-6">
                {generatedItinerary.flightOptions.map((flight, index) => (
                  <Card
                    key={index}
                    className="rounded-3xl shadow-xl border-0 bg-white"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-amber-900">
                          {flight.airline}
                        </h3>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-orange-600">
                            {flight.price}
                          </p>
                          <p className="text-sm text-amber-700">
                            {flight.stops}
                          </p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-amber-700">Route</p>
                          <p className="font-semibold text-amber-900">
                            {flight.route}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700">Departure</p>
                          <p className="font-semibold text-amber-900">
                            {flight.departure}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700">Duration</p>
                          <p className="font-semibold text-amber-900">
                            {flight.duration}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels">
              <div className="grid lg:grid-cols-2 gap-6">
                {generatedItinerary.hotelRecommendations.map((hotel, index) => (
                  <Card
                    key={index}
                    className="rounded-3xl shadow-xl border-0 bg-white"
                  >
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-amber-900">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-amber-800">
                            {hotel.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-amber-800 mb-3">{hotel.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-amber-800">
                            {hotel.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-orange-600" />
                          <span className="font-semibold text-orange-600">
                            {hotel.priceRange}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, i) => (
                          <Badge
                            key={i}
                            className="bg-orange-100 text-orange-800"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Daily Itinerary Tab */}
            <TabsContent value="daily">
              <div className="space-y-8">
                {generatedItinerary.dailyItinerary.map((day, index) => (
                  <Card
                    key={index}
                    className="rounded-3xl shadow-xl border-0 bg-white"
                  >
                    <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-t-3xl">
                      <CardTitle className="text-2xl text-amber-900">
                        Day {day.day}: {day.title}
                      </CardTitle>
                      <p className="text-amber-700">{day.theme}</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="flex gap-4 p-4 bg-orange-50 rounded-2xl"
                          >
                            <div className="flex-shrink-0">
                              <Clock className="h-5 w-5 text-orange-600 mt-1" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-amber-900">
                                  {activity.time}
                                </h4>
                                <span className="text-orange-600 font-semibold">
                                  {activity.cost}
                                </span>
                              </div>
                              <h5 className="font-bold text-amber-900 mb-1">
                                {activity.activity}
                              </h5>
                              <p className="text-amber-800 text-sm mb-2">
                                {activity.location}
                              </p>
                              <p className="text-amber-700 text-sm italic">
                                {activity.tips}
                              </p>
                            </div>
                          </div>
                        ))}

                        <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-orange-200">
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-2">
                              🍽️ Meals
                            </h4>
                            <ul className="space-y-1">
                              {day.meals.map((meal, mealIndex) => (
                                <li
                                  key={mealIndex}
                                  className="text-amber-800 text-sm"
                                >
                                  {meal}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-2">
                              🚗 Transportation
                            </h4>
                            <p className="text-amber-800 text-sm">
                              {day.transportation}
                            </p>
                            <p className="text-orange-600 font-semibold text-sm mt-1">
                              Daily Budget: {day.budget}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Food Tab */}
            <TabsContent value="food">
              <div className="grid lg:grid-cols-2 gap-6">
                {generatedItinerary.foodRecommendations.map(
                  (restaurant, index) => (
                    <Card
                      key={index}
                      className="rounded-3xl shadow-xl border-0 bg-white"
                    >
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-amber-900">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold text-amber-800">
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                        <Badge className="mb-3 bg-orange-100 text-orange-800">
                          {restaurant.cuisine}
                        </Badge>
                        <p className="text-amber-800 mb-4">
                          {restaurant.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span className="text-amber-800 text-sm">
                              {restaurant.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-orange-600" />
                            <span className="font-semibold text-orange-600">
                              {restaurant.priceRange}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-2">
                            Must Try:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {restaurant.mustTry.map((dish, i) => (
                              <Badge
                                key={i}
                                className="bg-yellow-100 text-yellow-800"
                              >
                                {dish}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips">
              <div className="grid gap-6">
                <Card className="rounded-3xl shadow-xl border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                      <Info className="h-6 w-6" />
                      Local Insights & Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      {Object.entries(generatedItinerary.localInsights).map(
                        ([category, info]) => (
                          <div
                            key={category}
                            className="bg-orange-50 rounded-2xl p-6"
                          >
                            <h3 className="font-bold text-amber-900 mb-3 capitalize">
                              {category}
                            </h3>
                            <p className="text-amber-800">{info}</p>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl shadow-xl border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                      🚨 Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      {generatedItinerary.emergencyContacts.map(
                        (contact, index) => (
                          <div
                            key={index}
                            className="bg-red-50 rounded-xl p-4 border-l-4 border-red-400"
                          >
                            <p className="text-red-800 font-semibold">
                              {contact}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-900 text-center">
              Export Your Itinerary
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <Button
              onClick={() => exportItinerary("pdf")}
              className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold py-4"
            >
              <FileText className="h-5 w-5 mr-3" />
              Download as PDF
            </Button>
            <Button
              onClick={() => exportItinerary("email")}
              className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4"
            >
              <Mail className="h-5 w-5 mr-3" />
              Email Itinerary
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
