"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Search,
  Cloud,
  Sun,
  CloudRain,
  Star,
  Mountain,
  BookOpen,
  Map,
  Luggage,
  Save,
  RefreshCw,
  Clock,
  DollarSign,
  Filter,
  Calendar,
  ThermometerSun,
  Gift,
  ArrowLeft,
  Sparkles,
  Camera,
  Heart,
} from "lucide-react"

export default function VoyaGenieApp() {
  const [destination, setDestination] = useState("")
  const [travelDates, setTravelDates] = useState("")
  const [duration, setDuration] = useState("")
  const [dateType, setDateType] = useState("dates") // "dates" or "duration"
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 })
  const [budget, setBudget] = useState("")
  const [currentScreen, setCurrentScreen] = useState("landing")
  const [showSurprisePopup, setShowSurprisePopup] = useState(false)
  const destinationRef = useRef<HTMLDivElement>(null)

  const scrollToDestination = () => {
    destinationRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDestinationSubmit = () => {
    if (destination.trim() && (travelDates.trim() || duration.trim()) && budget.trim()) {
      setCurrentScreen("destination")
    }
  }

  const adjustTravelers = (type: "adults" | "children", increment: boolean) => {
    setTravelers((prev) => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }))
  }

  const handleBackToLanding = () => {
    setCurrentScreen("landing")
    setDestination("")
  }

  const weatherData = [
    { day: "Today", temp: "28°C", icon: Sun, desc: "Sunny" },
    { day: "Tomorrow", temp: "26°C", icon: Cloud, desc: "Partly Cloudy" },
    { day: "Wed", temp: "24°C", icon: CloudRain, desc: "Light Rain" },
    { day: "Thu", temp: "30°C", icon: Sun, desc: "Hot & Sunny" },
    { day: "Fri", temp: "27°C", icon: Cloud, desc: "Warm & Cloudy" },
  ]

  const hotels = [
    {
      name: "Golden Sunset Resort",
      price: "$150/night",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Pool", "Spa", "Beach Access"],
    },
    {
      name: "Sunrise Mountain Lodge",
      price: "$120/night",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Restaurant", "Hiking", "Fireplace"],
    },
    {
      name: "Amber City Hotel",
      price: "$95/night",
      rating: 4.5,
      image: "/placeholder.svg?height=200&width=300",
      amenities: ["Rooftop Bar", "WiFi", "City View"],
    },
  ]

  const places = [
    {
      name: "Golden Temple",
      fee: "$20",
      timing: "6 AM - 8 PM",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
    },
    {
      name: "Sunset Beach",
      fee: "Free",
      timing: "24 Hours",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
    },
    {
      name: "Heritage Museum",
      fee: "$15",
      timing: "9 AM - 6 PM",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
    },
  ]

  const cuisines = [
    {
      name: "Spiced Golden Curry",
      rating: 4.8,
      image: "/placeholder.svg?height=150&width=200",
      tags: ["Aromatic", "Traditional"],
    },
    {
      name: "Honey Glazed Seafood",
      rating: 4.7,
      image: "/placeholder.svg?height=150&width=200",
      tags: ["Fresh", "Sweet"],
    },
    {
      name: "Sunset Street Tacos",
      rating: 4.6,
      image: "/placeholder.svg?height=150&width=200",
      tags: ["Spicy", "Local"],
    },
  ]

  const adventures = [
    {
      name: "Sunrise Hiking",
      difficulty: "Moderate",
      duration: "5 hours",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Golden Hour Photography",
      difficulty: "Easy",
      duration: "3 hours",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      name: "Desert Safari",
      difficulty: "Easy",
      duration: "4 hours",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const surpriseContent = {
    title: "Hidden Gem Discovered! ✨",
    place: "Secret Sunset Viewpoint",
    description:
      "A magical spot known only to locals, where the golden hour creates the most breathtaking views. Perfect for romantic moments and unforgettable photos!",
    tip: "Best visited 30 minutes before sunset with a picnic basket!",
    image: "/placeholder.svg?height=300&width=400",
  }

  if (currentScreen === "landing") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Warm Sunny Background */}
        <div className="fixed inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(255, 183, 77, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 138, 101, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 206, 84, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 60% 80%, rgba(255, 159, 67, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 90% 60%, rgba(255, 107, 107, 0.4) 0%, transparent 50%),
                linear-gradient(135deg, #FFF8E1 0%, #FFECB3 25%, #FFE0B2 50%, #FFCC80 75%, #FFB74D 100%)
              `,
            }}
          />

          <div className="absolute inset-0">
            <div
              className="absolute w-80 h-80 rounded-full opacity-30 animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(255, 183, 77, 0.6) 0%, transparent 70%)",
                top: "15%",
                left: "10%",
                animationDuration: "4s",
              }}
            />
            <div
              className="absolute w-60 h-60 rounded-full opacity-30 animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(255, 138, 101, 0.6) 0%, transparent 70%)",
                top: "50%",
                right: "15%",
                animationDuration: "6s",
                animationDelay: "2s",
              }}
            />
            <div
              className="absolute w-40 h-40 rounded-full opacity-30 animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(255, 206, 84, 0.6) 0%, transparent 70%)",
                bottom: "25%",
                left: "25%",
                animationDuration: "5s",
                animationDelay: "1s",
              }}
            />
          </div>
        </div>

        {/* Landing Section */}
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10 px-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
              VoyaGenie
            </h1>
            <p className="text-2xl md:text-3xl mb-12 text-amber-800 font-light italic drop-shadow-md">
              your travel wish-granter ☀️
            </p>
            <Button
              onClick={scrollToDestination}
              className="px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #FF5722 100%)",
                boxShadow: "0 8px 32px rgba(255, 87, 34, 0.3)",
              }}
            >
              Let's Go! 🌅
            </Button>
          </div>
        </section>

        {/* Enhanced Destination Input Section */}
        <section ref={destinationRef} className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card
              className="rounded-3xl shadow-2xl border-0"
              style={{
                background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
                boxShadow: "0 20px 60px rgba(255, 152, 0, 0.2)",
              }}
            >
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-amber-900 mb-2">Plan Your Perfect Journey ✨</CardTitle>
                <p className="text-amber-700 text-lg">Tell us about your dream trip and we'll make it magical!</p>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Destination Input */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Where would you like to explore? 🌍
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your dream destination (e.g., Goa, Manali, Paris)..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white pl-4"
                    />
                  </div>
                </div>

                {/* Travel Dates/Duration */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    When are you traveling? 📅
                  </label>

                  {/* Date Type Toggle */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      onClick={() => setDateType("dates")}
                      className={`rounded-full px-6 py-2 font-medium transition-all ${
                        dateType === "dates"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "bg-white text-orange-600 border border-orange-300 hover:bg-orange-50"
                      }`}
                    >
                      Specific Dates
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setDateType("duration")}
                      className={`rounded-full px-6 py-2 font-medium transition-all ${
                        dateType === "duration"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "bg-white text-orange-600 border border-orange-300 hover:bg-orange-50"
                      }`}
                    >
                      Duration
                    </Button>
                  </div>

                  {dateType === "dates" ? (
                    <Input
                      type="text"
                      placeholder="e.g., 25 July to 30 July or 15 Dec - 20 Dec"
                      value={travelDates}
                      onChange={(e) => setTravelDates(e.target.value)}
                      className="py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white"
                    />
                  ) : (
                    <Input
                      type="text"
                      placeholder="e.g., 5 days from tomorrow or 1 week in March"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white"
                    />
                  )}
                </div>

                {/* Number of Travelers */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <Luggage className="h-5 w-5" />
                    Who's going on this adventure? 👥
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Adults */}
                    <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-amber-900">Adults</p>
                          <p className="text-sm text-amber-700">Age 18+</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            onClick={() => adjustTravelers("adults", false)}
                            className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 p-0"
                          >
                            -
                          </Button>
                          <span className="text-xl font-bold text-amber-900 w-8 text-center">{travelers.adults}</span>
                          <Button
                            type="button"
                            onClick={() => adjustTravelers("adults", true)}
                            className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-amber-900">Children</p>
                          <p className="text-sm text-amber-700">Age 0-17</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            onClick={() => adjustTravelers("children", false)}
                            className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 p-0"
                          >
                            -
                          </Button>
                          <span className="text-xl font-bold text-amber-900 w-8 text-center">{travelers.children}</span>
                          <Button
                            type="button"
                            onClick={() => adjustTravelers("children", true)}
                            className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Traveler Summary */}
                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-3 text-center">
                    <p className="text-amber-800 font-medium">
                      Total: {travelers.adults + travelers.children} traveler
                      {travelers.adults + travelers.children !== 1 ? "s" : ""}
                      {travelers.adults > 0 &&
                        ` (${travelers.adults} adult${travelers.adults !== 1 ? "s" : ""}${travelers.children > 0 ? `, ${travelers.children} child${travelers.children !== 1 ? "ren" : ""}` : ""})`}
                    </p>
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    What's your budget range? 💰
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Under ₹20k", "₹20k - ₹50k", "₹50k - ₹1L", "Above ₹1L"].map((budgetOption) => (
                      <Button
                        key={budgetOption}
                        type="button"
                        onClick={() => setBudget(budgetOption)}
                        className={`rounded-2xl py-4 font-medium transition-all ${
                          budget === budgetOption
                            ? "bg-orange-500 text-white shadow-lg transform scale-105"
                            : "bg-white text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                        }`}
                      >
                        {budgetOption}
                      </Button>
                    ))}
                  </div>

                  {/* Custom Budget Input */}
                  <div className="mt-4">
                    <Input
                      placeholder="Or enter custom budget (e.g., $500, €800, ₹75000)..."
                      value={
                        budget.startsWith("Under") || budget.startsWith("₹") || budget.startsWith("Above") ? "" : budget
                      }
                      onChange={(e) => setBudget(e.target.value)}
                      className="py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    onClick={handleDestinationSubmit}
                    disabled={!destination.trim() || (!travelDates.trim() && !duration.trim()) || !budget.trim()}
                    className="w-full py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        destination.trim() && (travelDates.trim() || duration.trim()) && budget.trim()
                          ? "linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #FF5722 100%)"
                          : "linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%)",
                      boxShadow: "0 8px 32px rgba(255, 87, 34, 0.3)",
                    }}
                  >
                    <Search className="h-6 w-6 mr-3" />
                    Create My Perfect Journey! 🚀
                  </Button>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center space-x-2 pt-4">
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${destination.trim() ? "bg-orange-500" : "bg-orange-200"}`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${travelDates.trim() || duration.trim() ? "bg-orange-500" : "bg-orange-200"}`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${travelers.adults > 0 ? "bg-orange-500" : "bg-orange-200"}`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${budget.trim() ? "bg-orange-500" : "bg-orange-200"}`}
                  />
                </div>

                <p className="text-center text-amber-700 text-sm">
                  Fill in all details to unlock your personalized travel experience
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Warm Background for Destination Screen */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 25%, #FFCC80 50%, #FFB74D 75%, #FF9800 100%)
            `,
          }}
        />
      </div>

      {/* Header with Back Button - Updated */}
      <header className="sticky top-0 z-40 p-4" style={{ backgroundColor: "rgba(255, 183, 77, 0.95)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button onClick={handleBackToLanding} variant="ghost" className="text-white hover:bg-orange-400 rounded-full">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Search
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Exploring {destination} ☀️</h1>
            <p className="text-orange-100 text-sm">
              {travelers.adults + travelers.children} traveler{travelers.adults + travelers.children !== 1 ? "s" : ""} •
              {dateType === "dates" ? travelDates : duration} • {budget}
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { icon: Map, label: "Map" },
              { icon: Luggage, label: "Plan" },
              { icon: Save, label: "Save" },
              { icon: RefreshCw, label: "Convert" },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-orange-400"
                title={item.label}
              >
                <item.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Content Sections */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="weather" className="w-full">
            <TabsList
              className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8 rounded-2xl p-2"
              style={{
                background: "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
                boxShadow: "0 8px 32px rgba(255, 87, 34, 0.2)",
              }}
            >
              <TabsTrigger
                value="weather"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🌤️ Weather
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🏨 Hotels
              </TabsTrigger>
              <TabsTrigger
                value="places"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                📍 Places
              </TabsTrigger>
              <TabsTrigger
                value="cuisine"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🍽️ Cuisine
              </TabsTrigger>
              <TabsTrigger
                value="adventures"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🏞️ Adventures
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                📜 History
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600"
              >
                🖼️ Gallery
              </TabsTrigger>
            </TabsList>

            {/* Weather Tab */}
            <TabsContent value="weather">
              <Card
                className="rounded-3xl shadow-2xl border-0"
                style={{
                  background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                  boxShadow: "0 20px 60px rgba(255, 152, 0, 0.3)",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <ThermometerSun className="h-6 w-6" />
                    Weather Forecast for {destination}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weatherData.map((day, index) => (
                      <Card
                        key={index}
                        className="rounded-2xl border-0 shadow-lg"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                      >
                        <CardContent className="p-6 text-center">
                          <p className="font-semibold text-amber-800">{day.day}</p>
                          <day.icon className="h-12 w-12 mx-auto my-4 text-orange-500" />
                          <p className="text-2xl font-bold text-amber-900">{day.temp}</p>
                          <p className="text-sm text-amber-700">{day.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hotels Tab */}
            <TabsContent value="hotels">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Price Range
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rating
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Dates
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel, index) => (
                    <Card
                      key={index}
                      className="rounded-3xl shadow-2xl border-0 overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%)",
                        boxShadow: "0 15px 45px rgba(255, 152, 0, 0.2)",
                      }}
                    >
                      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }} />
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-4 w-4 text-yellow-600 fill-current" />
                          <span className="font-semibold text-amber-800">{hotel.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {hotel.amenities.map((amenity, i) => (
                            <Badge key={i} className="rounded-full text-xs bg-orange-200 text-orange-800">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-amber-900">{hotel.price}</span>
                          <Button
                            className="rounded-full text-white font-bold"
                            style={{
                              background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Places Tab */}
            <TabsContent value="places">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place, index) => (
                  <Card
                    key={index}
                    className="rounded-3xl shadow-2xl border-0 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
                      boxShadow: "0 15px 45px rgba(255, 152, 0, 0.2)",
                    }}
                  >
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${place.image})` }} />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-amber-900 mb-2">{place.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-600 fill-current" />
                        <span className="font-semibold text-amber-800">{place.rating}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-700" />
                          <span className="text-amber-800">Entry Fee: {place.fee}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-700" />
                          <span className="text-amber-800">Timing: {place.timing}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full rounded-full text-white font-bold"
                        style={{
                          background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Cuisine Tab */}
            <TabsContent value="cuisine">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cuisines.map((dish, index) => (
                  <Card
                    key={index}
                    className="rounded-3xl shadow-2xl border-0 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%)",
                      boxShadow: "0 15px 45px rgba(255, 152, 0, 0.2)",
                    }}
                  >
                    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${dish.image})` }} />
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-amber-900 mb-2">{dish.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-600 fill-current" />
                        <span className="font-semibold text-amber-800">{dish.rating}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dish.tags.map((tag, i) => (
                          <Badge key={i} className="rounded-full text-xs bg-orange-200 text-orange-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Adventures Tab */}
            <TabsContent value="adventures">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adventures.map((adventure, index) => (
                  <Card
                    key={index}
                    className="rounded-3xl shadow-2xl border-0 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
                      boxShadow: "0 15px 45px rgba(255, 87, 34, 0.3)",
                    }}
                  >
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${adventure.image})` }} />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{adventure.name}</h3>
                      <div className="space-y-2 mb-4 text-white">
                        <div className="flex items-center gap-2">
                          <Mountain className="h-4 w-4" />
                          <span>Difficulty: {adventure.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Duration: {adventure.duration}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full rounded-full text-white font-bold"
                        style={{
                          background: "linear-gradient(135deg, #FF5722 0%, #D84315 100%)",
                        }}
                      >
                        Book Adventure
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card
                className="rounded-3xl shadow-2xl border-0"
                style={{
                  background: "linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%)",
                  boxShadow: "0 20px 60px rgba(255, 152, 0, 0.3)",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    Historical Facts about {destination}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-amber-900 mb-3">Golden Age Origins</h3>
                      <p className="text-amber-800 leading-relaxed">
                        This magnificent destination has a rich history dating back over 2,000 years. Ancient
                        civilizations once thrived here, leaving behind remarkable architectural wonders and cultural
                        traditions that continue to this day.
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-amber-900 mb-3">Cultural Heritage</h3>
                      <p className="text-amber-800 leading-relaxed">
                        The local culture is a beautiful blend of traditional customs and modern influences. Festivals,
                        art forms, and culinary traditions have been passed down through generations, creating a unique
                        cultural tapestry.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={{
                      background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
                      boxShadow: "0 8px 32px rgba(255, 152, 0, 0.2)",
                    }}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url(/placeholder.svg?height=300&width=300)` }}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Big Floating Surprise Button */}
      <Button
        onClick={() => setShowSurprisePopup(true)}
        className="fixed bottom-8 right-8 rounded-full w-20 h-20 shadow-2xl animate-bounce text-white font-bold text-lg"
        style={{
          background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)",
          boxShadow: "0 12px 40px rgba(255, 107, 53, 0.4)",
        }}
        title="Surprise Me!"
      >
        <div className="flex flex-col items-center">
          <Sparkles className="h-8 w-8 mb-1" />
          <span className="text-xs">Surprise!</span>
        </div>
      </Button>

      {/* Big Surprise Popup */}
      <Dialog open={showSurprisePopup} onOpenChange={setShowSurprisePopup}>
        <DialogContent
          className="max-w-2xl rounded-3xl border-0 p-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 50%, #FFB74D 100%)",
            boxShadow: "0 25px 80px rgba(255, 152, 0, 0.4)",
          }}
        >
          <div className="relative">
            {/* Header with sparkles */}
            <div className="text-center p-8 pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Sparkles className="h-16 w-16 text-yellow-500 animate-pulse" />
                  <Heart className="absolute -top-2 -right-2 h-6 w-6 text-red-500 animate-bounce" />
                </div>
              </div>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-amber-900 mb-2">{surpriseContent.title}</DialogTitle>
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <div
                  className="h-48 bg-cover bg-center rounded-xl mb-4"
                  style={{ backgroundImage: `url(${surpriseContent.image})` }}
                />
                <h3 className="text-2xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-orange-600" />
                  {surpriseContent.place}
                </h3>
                <p className="text-amber-800 leading-relaxed mb-4">{surpriseContent.description}</p>
                <div
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-l-4"
                  style={{ borderColor: "#FF9800" }}
                >
                  <p className="text-amber-900 font-semibold flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Pro Tip: {surpriseContent.tip}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 rounded-full text-white font-bold py-3"
                  style={{
                    background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                  }}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Add to My Trip
                </Button>
                <Button
                  className="flex-1 rounded-full text-white font-bold py-3"
                  style={{
                    background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                  }}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
