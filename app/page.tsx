"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Navigation,
  MapPin,
  Search,
  Cloud,
  Sun,
  CloudRain,
  Star,
  Mountain,
  BookOpen,
  Luggage,
  RefreshCw,
  Clock,
  DollarSign,
  Filter,
  Calendar,
  ThermometerSun,
  ArrowLeft,
  Sparkles,
  Loader2,
  MapIcon,
  Phone,
  Heart,
  Gift,
  Camera,
} from "lucide-react"
import MapComponent from "@/components/map-component"
// import { generateText } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai"

// Types for API responses
interface WeatherData {
  day: string
  temp: string
  icon: any
  desc: string
}

interface Hotel {
  id: string
  name: string
  price: string
  rating?: number
  image: string
  amenities: string[]
  address?: string
  phone?: string
}

interface Place {
  id: string
  name: string
  category: string
  address: string
  rating?: number
  distance?: string
  coordinates?: { lat: number; lng: number }
  image?: string
}

interface Cuisine {
  name: string
  rating: number
  image: string
  tags: string[]
  description?: string
  restaurant?: string
  price?: string
}

interface Adventure {
  name: string
  difficulty: string
  duration: string
  image: string
  description?: string
  price?: string
  bestTime?: string
}

interface HistoryContent {
  title: string
  content: string
  period?: string
  significance?: string
  image?: string
}

interface SurpriseContent {
  title: string
  place: string
  description: string
  tip: string
  image: string
  category?: string
  bestTime?: string
}

export default function VoyaGenieApp() {
  // Fetch images from Pexels API
  const fetchImagesFromPexels = async (query: string) => {
    const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY as string
    if (!apiKey) return []
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: {
        Authorization: apiKey,
      },
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.photos || []
  }

  // Gallery state for Pexels images
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [destination, setDestination] = useState("")
  const [fromLocation, setFromLocation] = useState("")
  const [travelDates, setTravelDates] = useState("")
  const [duration, setDuration] = useState("")
  useEffect(() => {
    const loadImages = async () => {
      if (destination) {
        const results = await fetchImagesFromPexels(destination)
        setGalleryImages(results)
      }
    }
    loadImages()
  }, [destination])
  const [dateType, setDateType] = useState("dates")
  const [travelers, setTravelers] = useState({ adults: 2, children: 0 })
  const [budget, setBudget] = useState("")
  const [currentScreen, setCurrentScreen] = useState("landing")
  const [showSurprisePopup, setShowSurprisePopup] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const destinationRef = useRef<HTMLDivElement>(null)

  // API Data States
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    { day: "Today", temp: "28°C", icon: Sun, desc: "Sunny" },
    { day: "Tomorrow", temp: "26°C", icon: Cloud, desc: "Partly Cloudy" },
    { day: "Wed", temp: "24°C", icon: CloudRain, desc: "Light Rain" },
    { day: "Thu", temp: "30°C", icon: Sun, desc: "Hot & Sunny" },
    { day: "Fri", temp: "27°C", icon: Cloud, desc: "Warm & Cloudy" },
  ])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [cuisines, setCuisines] = useState<Cuisine[]>([])
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [historyContent, setHistoryContent] = useState<HistoryContent[]>([])
  const [surpriseContent, setSurpriseContent] = useState<SurpriseContent | null>(null)

  type Coordinate = { lat: number; lng: number }
  const [destinationCoords, setDestinationCoords] = useState<Coordinate | null>(null)

  // Loading States
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [isLoadingHotels, setIsLoadingHotels] = useState(false)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [isLoadingCuisines, setIsLoadingCuisines] = useState(false)
  const [isLoadingAdventures, setIsLoadingAdventures] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isLoadingSurprise, setIsLoadingSurprise] = useState(false)

  const [weatherError, setWeatherError] = useState("")
  const [hotelsError, setHotelsError] = useState("")
  const [placesError, setPlacesError] = useState("")
  const [cuisinesError, setCuisinesError] = useState("")
  const [adventuresError, setAdventuresError] = useState("")
  const [historyError, setHistoryError] = useState("")
  const [surpriseError, setSurpriseError] = useState("")

  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null)
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false)
  const [itineraryError, setItineraryError] = useState("")

  const [showConvertModal, setShowConvertModal] = useState(false)
  const [exchangeRates, setExchangeRates] = useState<any>(null)
  const [isLoadingRates, setIsLoadingRates] = useState(false)
  const [selectedFromCurrency, setSelectedFromCurrency] = useState("USD")
  const [selectedToCurrency, setSelectedToCurrency] = useState("INR")
  const [amountToConvert, setAmountToConvert] = useState("")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [textToTranslate, setTextToTranslate] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [fromLanguage, setFromLanguage] = useState("en")
  const [toLanguage, setToLanguage] = useState("hi")

  const scrollToDestination = () => {
    destinationRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDestinationSubmit = () => {
    if (fromLocation.trim() && destination.trim() && (travelDates.trim() || duration.trim()) && budget.trim()) {
      setCurrentScreen("destination")
    }
  }

  const adjustTravelers = (type: "adults" | "children", increment: boolean) => {
    setTravelers((prev) => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }))
  }

  // Fetch photos from Unsplash API
  // Fetch photo from Pexels API (single image for cards, fallback to placeholder)
  const fetchPhoto = async (query: string, fallbackText = "travel") => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY as string
      if (!apiKey) {
        throw new Error("Pexels API key missing")
      }
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: {
          Authorization: apiKey,
        },
      })
      if (!response.ok) {
        throw new Error("Photo fetch failed")
      }
      const data = await response.json()
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src?.large || data.photos[0].src?.medium || data.photos[0].src?.original
      } else {
        // Fallback to placeholder if no results
        return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(fallbackText)}`
      }
    } catch (error) {
      console.error("Error fetching photo:", error)
      // Return placeholder image if API fails
      return `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(fallbackText)}`
    }
  }

  // Get coordinates for a location
  const getLocationCoordinates = async (location: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: Number.parseFloat(data[0].lat),
          lng: Number.parseFloat(data[0].lon),
        }
      }
      return null
    } catch (error) {
      console.error("Error getting coordinates:", error)
      return null
    }
  }

  // Fetch Weather Data using Gemini AI
  const fetchWeatherData = async (location: string) => {
    setIsLoadingWeather(true)
    setWeatherError("")

    try {
      const prompt = `Generate a 5-day weather forecast for ${location} in JSON format.

    Return ONLY a valid JSON array with this exact structure:
    [
      {
        "day": "Today",
        "temp": "28°C",
        "condition": "sunny",
        "desc": "Sunny and clear"
      },
      {
        "day": "Tomorrow", 
        "temp": "26°C",
        "condition": "cloudy",
        "desc": "Partly cloudy"
      }
    ]

    Include realistic temperatures for ${location}'s current season.
    Use conditions: "sunny", "cloudy", "rainy", "stormy" for proper icons.
    Make the forecast realistic and location-appropriate.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setWeatherError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsLoadingWeather(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      const getWeatherIcon = (condition: string) => {
        const lowerCondition = condition.toLowerCase()
        if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) return Sun
        if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) return CloudRain
        if (lowerCondition.includes("cloud") || lowerCondition.includes("overcast")) return Cloud
        return Sun
      }

      let weatherResponse: any[]
      try {
        weatherResponse = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("Weather JSON parsing error:", parseError)
        // Fallback weather data
        weatherResponse = [
          { day: "Today", temp: "25°C", condition: "sunny", desc: "Sunny" },
          {
            day: "Tomorrow",
            temp: "23°C",
            condition: "cloudy",
            desc: "Partly Cloudy",
          },
          { day: "Wed", temp: "21°C", condition: "rainy", desc: "Light Rain" },
          { day: "Thu", temp: "27°C", condition: "sunny", desc: "Hot & Sunny" },
          {
            day: "Fri",
            temp: "24°C",
            condition: "cloudy",
            desc: "Warm & Cloudy",
          },
        ]
      }

      const formattedWeatherData: WeatherData[] = weatherResponse.map((day: any, index: number) => ({
        day: day.day || `Day ${index + 1}`,
        temp: day.temp || "N/A",
        icon: getWeatherIcon(day.condition || day.desc || "sunny"),
        desc: day.desc || "Weather info",
      }))

      // Ensure we have exactly 5 days
      while (formattedWeatherData.length < 5) {
        const remainingIndex = formattedWeatherData.length
        const dayNames = ["Today", "Tomorrow", "Wed", "Thu", "Fri"]
        formattedWeatherData.push({
          day: dayNames[remainingIndex] || `Day ${remainingIndex + 1}`,
          temp: "N/A",
          icon: Cloud,
          desc: "Data unavailable",
        })
      }

      setWeatherData(formattedWeatherData.slice(0, 5))
      setWeatherError("")
    } catch (error) {
      console.error("Weather fetch error:", error)
      setWeatherError("Unable to fetch weather data")

      // Fallback weather data
      setWeatherData([
        { day: "Today", temp: "--", icon: Sun, desc: "--" },
        { day: "Tomorrow", temp: "--", icon: Cloud, desc: "--" },
        { day: "Wed", temp: "--", icon: CloudRain, desc: "--" },
        { day: "Thu", temp: "--", icon: Sun, desc: "--" },
        { day: "Fri", temp: "--", icon: Cloud, desc: "--" },
      ])
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // Fetch Hotels Data using Gemini AI
  const fetchHotelsData = async (location: string) => {
    setIsLoadingHotels(true)
    setHotelsError("")

    try {
      const prompt = `Generate a list of 8-12 hotels for ${location} in JSON format. Include a mix of budget, mid-range, and luxury options. 

    Return ONLY a valid JSON array with this exact structure:
    [
      {
        "id": "unique_id",
        "name": "Hotel Name",
        "price": "₹X,XXX/night or $XXX/night",
        "rating": 4.5,
        "amenities": ["Free WiFi", "Breakfast", "Pool", "Spa"],
        "address": "Street Address, ${location}",
        "phone": "+XX-XXXXXXXXXX"
      }
    ]

    Make the hotels realistic for ${location} with appropriate:
    - Local hotel names that sound authentic
    - Realistic pricing in local currency
    - Ratings between 3.5-4.9
    - Relevant amenities for the location
    - Proper addresses and phone numbers
    - Mix of hotel types (boutique, resort, business, budget)`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setHotelsError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsLoadingHotels(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      // Clean the response to extract JSON
      let jsonText = text.trim()

      // Remove markdown code blocks if present
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText
          .replace(/^```json\s*/, "")
          .replace(/\s*```json\s*/, "")
          .replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      // Parse the JSON
      let hotelsData: any[]
      try {
        hotelsData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("JSON parsing error:", parseError)
        console.log("Raw response:", text)

        // Fallback to mock data if JSON parsing fails
        hotelsData = [
          {
            id: "1",
            name: `Grand Palace Hotel - ${location}`,
            price: "₹8,500/night",
            rating: 4.6,
            amenities: ["Free WiFi", "Breakfast", "Pool", "Spa"],
            address: `Palace Road, ${location}`,
            phone: "+91-98765-43210",
          },
          {
            id: "2",
            name: `Sunset Resort - ${location}`,
            price: "₹12,000/night",
            rating: 4.8,
            amenities: ["Beachfront", "Restaurant", "Bar", "Gym"],
            address: `Beach Road, ${location}`,
            phone: "+91-87654-32109",
          },
          {
            id: "3",
            name: `Budget Inn - ${location}`,
            price: "₹2,500/night",
            rating: 4.1,
            amenities: ["Free WiFi", "AC", "Room Service"],
            address: `Main Street, ${location}`,
            phone: "+91-76543-21098",
          },
        ]
      }

      // Fetch images for each hotel and validate structure
      const validatedHotels: Hotel[] = await Promise.all(
        hotelsData.map(async (hotel: any, index: number) => {
          const hotelImage = await fetchPhoto(`${hotel.name || "hotel"} ${location}`, "luxury hotel")
          return {
            id: hotel.id || `hotel_${index + 1}`,
            name: hotel.name || `Hotel ${index + 1} - ${location}`,
            price: hotel.price || "Price on request",
            rating: typeof hotel.rating === "number" ? hotel.rating : 4.0,
            image: hotelImage,
            amenities: Array.isArray(hotel.amenities) ? hotel.amenities : ["Free WiFi", "AC"],
            address: hotel.address || `${location}`,
            phone: hotel.phone || "Contact hotel directly",
          }
        }),
      )

      setHotels(validatedHotels.slice(0, 12)) // Limit to 12 hotels
      setHotelsError("")
    } catch (error) {
      console.error("Hotels fetch error:", error)
      setHotelsError("Unable to fetch hotel recommendations. Please try again.")

      // Set fallback mock data
      const fallbackHotels: Hotel[] = [
        {
          id: "fallback_1",
          name: `Heritage Hotel - ${location}`,
          price: "₹6,500/night",
          rating: 4.4,
          image: "/placeholder.svg?height=200&width=300&text=Heritage+Hotel",
          amenities: ["Free WiFi", "Restaurant", "Heritage Building"],
          address: `Heritage Quarter, ${location}`,
          phone: "+91-99887-76655",
        },
        {
          id: "fallback_2",
          name: `Modern Suites - ${location}`,
          price: "₹9,200/night",
          rating: 4.7,
          image: "/placeholder.svg?height=200&width=300&text=Modern+Suites",
          amenities: ["Business Center", "Gym", "Rooftop Pool"],
          address: `Business District, ${location}`,
          phone: "+91-88776-65544",
        },
      ]
      setHotels(fallbackHotels)
    } finally {
      setIsLoadingHotels(false)
    }
  }

  // Fetch Places Data using Gemini AI
  const fetchPlacesData = async (location: string) => {
    setIsLoadingPlaces(true)
    setPlacesError("")

    try {
      const prompt = `Generate a list of 6-8 popular tourist places in ${location} in JSON format.

  Return ONLY a valid JSON array with this structure:
  [
    {
      "name": "Place Name",
      "category": "Attraction Category (e.g., Historical Site, Park, Beach)",
      "description": "Brief description of the place",
      "address": "Exact or nearby address",
      "rating": 4.7
    }
  ]

  Include a mix of famous spots and hidden gems, with varied categories.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setPlacesError("Google Generative AI API key is missing.")
        setIsLoadingPlaces(false)
        return
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      let placesData: any[]
      try {
        placesData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("Places JSON parsing error:", parseError)
        throw new Error("Unable to parse AI response.")
      }

      const validatedPlaces: Place[] = await Promise.all(
        placesData.map(async (place: any, index: number) => {
          const placeImage = await fetchPhoto(`${place.name || "place"} ${location}`, "landmark")
          return {
            id: `${place.name || index}-${location}`,
            name: place.name || `Place ${index + 1}`,
            category: place.category || "Attraction",
            address: place.address || `Famous site in ${location}`,
            rating: typeof place.rating === "number" ? place.rating : 4.5,
            image: placeImage,
          }
        }),
      )

      setPlaces(validatedPlaces)
      setPlacesError("")
    } catch (error) {
      console.error("Places fetch error:", error)
      setPlacesError("Unable to fetch place recommendations")

      // Optional fallback
      setPlaces([
        {
          id: "1",
          name: `Popular Site - ${location}`,
          category: "Sightseeing",
          address: `Main attraction in ${location}`,
          rating: 4.6,
          image: "/placeholder.svg?height=200&width=300&text=Popular+Place",
        },
      ])
    } finally {
      setIsLoadingPlaces(false)
    }
  }


  // Fetch Cuisines Data using Gemini AI
  const fetchCuisinesData = async (location: string) => {
    setIsLoadingCuisines(true)
    setCuisinesError("")

    try {
      const prompt = `Generate a list of 6-8 popular local dishes and cuisines for ${location} in JSON format.

      Return ONLY a valid JSON array with this exact structure:
      [
        {
          "name": "Dish Name",
          "rating": 4.7,
          "tags": ["Spicy", "Traditional", "Vegetarian"],
          "description": "Brief description of the dish and its flavors",
          "restaurant": "Popular restaurant name serving this dish",
          "price": "₹XXX or $XX"
        }
      ]

      Focus on authentic local specialties, street food, and signature dishes of ${location}.
      Include variety in cuisine types, spice levels, and price ranges.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setCuisinesError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsLoadingCuisines(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      let cuisinesData: any[]
      try {
        cuisinesData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("Cuisines JSON parsing error:", parseError)
        cuisinesData = [
          {
            name: `Traditional ${location} Curry`,
            rating: 4.8,
            tags: ["Aromatic", "Traditional", "Spicy"],
            description: "A rich and flavorful curry with local spices",
            restaurant: `Local Spice Kitchen - ${location}`,
            price: "₹350",
          },
          {
            name: `${location} Street Food Special`,
            rating: 4.6,
            tags: ["Street Food", "Popular", "Quick"],
            description: "Famous street food loved by locals and tourists",
            restaurant: `Street Corner - ${location}`,
            price: "₹150",
          },
        ]
      }

      const validatedCuisines: Cuisine[] = await Promise.all(
        cuisinesData.map(async (cuisine: any, index: number) => {
          const dishImage = await fetchPhoto(`${cuisine.name || "food"} ${location}`, "delicious food")
          return {
            name: cuisine.name || `Local Dish ${index + 1}`,
            rating: typeof cuisine.rating === "number" ? cuisine.rating : 4.5,
            image: dishImage,
            tags: Array.isArray(cuisine.tags) ? cuisine.tags : ["Local", "Popular"],
            description: cuisine.description || "Delicious local specialty",
            restaurant: cuisine.restaurant || `Local Restaurant - ${location}`,
            price: cuisine.price || "Price varies",
          }
        }),
      )

      setCuisines(validatedCuisines)
      setCuisinesError("")
    } catch (error) {
      console.error("Cuisines fetch error:", error)
      setCuisinesError("Unable to fetch cuisine recommendations")

      // Fallback data
      setCuisines([
        {
          name: `Spiced Golden Curry - ${location}`,
          rating: 4.8,
          image: "/placeholder.svg?height=150&width=200&text=Golden+Curry",
          tags: ["Aromatic", "Traditional"],
          description: "A signature curry with local spices and herbs",
          restaurant: `Heritage Kitchen - ${location}`,
          price: "₹400",
        },
      ])
    } finally {
      setIsLoadingCuisines(false)
    }
  }

  // Fetch Adventures Data using Gemini AI
  const fetchAdventuresData = async (location: string) => {
    setIsLoadingAdventures(true)
    setAdventuresError("")

    try {
      const prompt = `Generate a list of 6-8 adventure activities and experiences for ${location} in JSON format.

      Return ONLY a valid JSON array with this exact structure:
      [
        {
          "name": "Adventure Activity Name",
          "difficulty": "Easy/Moderate/Hard",
          "duration": "X hours/days",
          "description": "Detailed description of the adventure activity",
          "price": "₹XXX or $XX per person",
          "bestTime": "Best time to do this activity"
        }
      ]

      Include variety like hiking, water sports, cultural experiences, wildlife, photography tours, etc.
      Make activities specific to ${location}'s geography and attractions.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setAdventuresError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsLoadingAdventures(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      let adventuresData: any[]
      try {
        adventuresData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("Adventures JSON parsing error:", parseError)
        adventuresData = [
          {
            name: `${location} Hiking Trail`,
            difficulty: "Moderate",
            duration: "5 hours",
            description: "Scenic hiking trail with beautiful views",
            price: "₹800 per person",
            bestTime: "Early morning",
          },
        ]
      }

      const validatedAdventures: Adventure[] = await Promise.all(
        adventuresData.map(async (adventure: any, index: number) => {
          const adventureImage = await fetchPhoto(`${adventure.name || "adventure"} ${location}`, "adventure activity")
          return {
            name: adventure.name || `Adventure ${index + 1}`,
            difficulty: adventure.difficulty || "Moderate",
            duration: adventure.duration || "Half day",
            image: adventureImage,
            description: adventure.description || "Exciting adventure activity",
            price: adventure.price || "Contact for pricing",
            bestTime: adventure.bestTime || "Depends on season",
          }
        }),
      )

      setAdventures(validatedAdventures)
      setAdventuresError("")
    } catch (error) {
      console.error("Adventures fetch error:", error)
      setAdventuresError("Unable to fetch adventure recommendations")

      // Fallback data
      setAdventures([
        {
          name: `Sunrise Hiking - ${location}`,
          difficulty: "Moderate",
          duration: "5 hours",
          image: "/placeholder.svg?height=200&width=300&text=Sunrise+Hiking",
          description: "Early morning hike to catch the beautiful sunrise",
          price: "₹1200 per person",
          bestTime: "5:00 AM start",
        },
      ])
    } finally {
      setIsLoadingAdventures(false)
    }
  }

  // Fetch History Data using Gemini AI
  const fetchHistoryData = async (location: string) => {
    setIsLoadingHistory(true)
    setHistoryError("")

    try {
      const prompt = `Generate historical information about ${location} in JSON format.

      Return ONLY a valid JSON array with this exact structure:
      [
        {
          "title": "Historical Period/Event Title",
          "content": "Detailed historical information and facts",
          "period": "Time period (e.g., '12th-15th Century')",
          "significance": "Why this is historically significant"
        }
      ]

      Include 3-4 major historical periods, events, or aspects of ${location}.
      Focus on authentic historical facts, cultural heritage, architectural significance, etc.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setHistoryError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsLoadingHistory(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      let historyData: any[]
      try {
        historyData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("History JSON parsing error:", parseError)
        historyData = [
          {
            title: `Ancient Origins of ${location}`,
            content: `${location} has a rich history dating back centuries, with evidence of early settlements and cultural development.`,
            period: "Ancient Times",
            significance: "Foundation of local culture and traditions",
          },
        ]
      }

      const validatedHistory: HistoryContent[] = await Promise.all(
        historyData.map(async (history: any, index: number) => {
          const historyImage = await fetchPhoto(`${history.title || "history"} ${location}`, "historical monument")
          return {
            title: history.title || `Historical Period ${index + 1}`,
            content: history.content || "Historical information about this period",
            period: history.period || "Historical period",
            significance: history.significance || "Significant historical importance",
            image: historyImage,
          }
        }),
      )

      setHistoryContent(validatedHistory)
      setHistoryError("")
    } catch (error) {
      console.error("History fetch error:", error)
      setHistoryError("Unable to fetch historical information")

      // Fallback data
      setHistoryContent([
        {
          title: `Golden Age Origins - ${location}`,
          content: `This magnificent destination has a rich history dating back over 2,000 years. Ancient civilizations once thrived here, leaving behind remarkable architectural wonders and cultural traditions that continue to this day.`,
          period: "Ancient Era",
          significance: "Foundation of cultural heritage",
          image: "/placeholder.svg?height=200&width=300&text=Historical+Monument",
        },
      ])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Fetch Surprise Content using Gemini AI
  const fetchSurpriseContent = async (location: string) => {
    setIsLoadingSurprise(true)
    setSurpriseError("")

    try {
      const prompt = `Generate a hidden gem or surprise location for ${location} in JSON format.

      Return ONLY a valid JSON object with this exact structure:
      {
        "title": "Surprise discovery title with emoji",
        "place": "Name of the hidden gem/secret spot",
        "description": "Detailed description of why this place is special and magical",
        "tip": "Practical tip for visiting this place",
        "category": "Type of place (viewpoint, cafe, temple, etc.)",
        "bestTime": "Best time to visit"
      }

      Focus on authentic hidden gems, local secrets, or lesser-known beautiful spots in ${location}.
      Make it sound magical and exciting for travelers.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setSurpriseError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsLoadingSurprise(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      let surpriseData: any
      try {
        surpriseData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("Surprise JSON parsing error:", parseError)
        surpriseData = {
          title: "Hidden Gem Discovered! ✨",
          place: `Secret Viewpoint - ${location}`,
          description:
            "A magical spot known only to locals, where the golden hour creates the most breathtaking views. Perfect for romantic moments and unforgettable photos!",
          tip: "Best visited 30 minutes before sunset with a picnic basket!",
          category: "Scenic Viewpoint",
          bestTime: "Golden hour",
        }
      }

      const surpriseImage = await fetchPhoto(`${surpriseData.place || "hidden gem"} ${location}`, "hidden gem")

      const validatedSurprise: SurpriseContent = {
        title: surpriseData.title || "Hidden Gem Discovered! ✨",
        place: surpriseData.place || `Secret Spot - ${location}`,
        description: surpriseData.description || "A magical hidden location waiting to be discovered",
        tip: surpriseData.tip || "Visit during off-peak hours for the best experience",
        image: surpriseImage,
        category: surpriseData.category || "Hidden Gem",
        bestTime: surpriseData.bestTime || "Anytime",
      }

      setSurpriseContent(validatedSurprise)
      setSurpriseError("")
    } catch (error) {
      console.error("Surprise fetch error:", error)
      setSurpriseError("Unable to fetch surprise content")

      // Fallback data
      setSurpriseContent({
        title: "Hidden Gem Discovered! ✨",
        place: `Secret Sunset Viewpoint - ${location}`,
        description:
          "A magical spot known only to locals, where the golden hour creates the most breathtaking views. Perfect for romantic moments and unforgettable photos!",
        tip: "Best visited 30 minutes before sunset with a picnic basket!",
        image: "/placeholder.svg?height=300&width=400&text=Secret+Viewpoint",
        category: "Scenic Viewpoint",
        bestTime: "Golden hour",
      })
    } finally {
      setIsLoadingSurprise(false)
    }
  }

  // Currency conversion functions
  const fetchExchangeRates = async (baseCurrency = "USD") => {
    setIsLoadingRates(true)
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_API_KEY}/latest/${baseCurrency}`)
      const data = await response.json()
      if (data.result === "success") {
        setExchangeRates(data)
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
    } finally {
      setIsLoadingRates(false)
    }
  }

  const convertCurrency = () => {
    if (!exchangeRates || !amountToConvert) return

    const amount = Number.parseFloat(amountToConvert)
    if (isNaN(amount)) return

    let convertedValue
    if (selectedFromCurrency === exchangeRates.base_code) {
      // Converting from base currency
      convertedValue = amount * exchangeRates.conversion_rates[selectedToCurrency]
    } else if (selectedToCurrency === exchangeRates.base_code) {
      // Converting to base currency
      convertedValue = amount / exchangeRates.conversion_rates[selectedFromCurrency]
    } else {
      // Converting between two non-base currencies
      const toBase = amount / exchangeRates.conversion_rates[selectedFromCurrency]
      convertedValue = toBase * exchangeRates.conversion_rates[selectedToCurrency]
    }

    setConvertedAmount(convertedValue.toFixed(2))
  }

  // Language translation function
  const translateText = async () => {
    if (!textToTranslate.trim()) return

    setIsTranslating(true)
    try {
      const prompt = `Translate the following text from ${getLanguageName(fromLanguage)} to ${getLanguageName(toLanguage)}. Return only the translation without any additional text or explanation:

"${textToTranslate}"`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setTranslatedText("Translation API key missing")
        return
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const translation = result.response.text().trim()

      setTranslatedText(translation)
    } catch (error) {
      console.error("Translation error:", error)
      setTranslatedText("Translation failed. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      en: "English",
      hi: "Hindi",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      ar: "Arabic",
      th: "Thai",
      vi: "Vietnamese",
      tr: "Turkish",
      nl: "Dutch",
      sv: "Swedish",
      da: "Danish",
      no: "Norwegian",
      fi: "Finnish",
    }
    return languages[code] || code.toUpperCase()
  }

  // Auto-detect destination currency and language
  const getDestinationDefaults = (destination: string) => {
    const countryDefaults: { [key: string]: { currency: string; language: string } } = {
      // Popular destinations
      goa: { currency: "INR", language: "hi" },
      manali: { currency: "INR", language: "hi" },
      kerala: { currency: "INR", language: "hi" },
      rajasthan: { currency: "INR", language: "hi" },
      mumbai: { currency: "INR", language: "hi" },
      delhi: { currency: "INR", language: "hi" },
      bangalore: { currency: "INR", language: "hi" },
      paris: { currency: "EUR", language: "fr" },
      london: { currency: "GBP", language: "en" },
      tokyo: { currency: "JPY", language: "ja" },
      bangkok: { currency: "THB", language: "th" },
      dubai: { currency: "AED", language: "ar" },
      singapore: { currency: "SGD", language: "en" },
      bali: { currency: "IDR", language: "id" },
      maldives: { currency: "MVR", language: "dv" },
      "sri lanka": { currency: "LKR", language: "si" },
      nepal: { currency: "NPR", language: "ne" },
      bhutan: { currency: "BTN", language: "dz" },
      "new york": { currency: "USD", language: "en" },
      "los angeles": { currency: "USD", language: "en" },
      sydney: { currency: "AUD", language: "en" },
      melbourne: { currency: "AUD", language: "en" },
      toronto: { currency: "CAD", language: "en" },
      vancouver: { currency: "CAD", language: "en" },
    }

    const key = destination.toLowerCase()
    return countryDefaults[key] || { currency: "USD", language: "en" }
  }

  // Export itinerary to PDF
  const exportToPDF = () => {
    if (!generatedItinerary) return

    const content = `
VoyaGenie - ${destination} Itinerary

Destination: ${destination}
Travelers: ${travelers.adults + travelers.children} travelers
Dates: ${dateType === "dates" ? travelDates : duration}
Budget: ${budget}

${generatedItinerary.summary || ""}

${generatedItinerary.rawContent || JSON.stringify(generatedItinerary, null, 2)}
  `

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${destination}-itinerary.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Email itinerary
  const emailItinerary = () => {
    if (!generatedItinerary) return

    const subject = `VoyaGenie - ${destination} Travel Itinerary`
    const body = `
Hi there!

Here's your personalized travel itinerary for ${destination}:

Destination: ${destination}
Travelers: ${travelers.adults + travelers.children} travelers  
Dates: ${dateType === "dates" ? travelDates : duration}
Budget: ${budget}

${generatedItinerary.summary || ""}

${generatedItinerary.rawContent || "Please check the attached detailed itinerary."}

Happy travels!
VoyaGenie Team
  `

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  const handleBackToLanding = () => {
    setCurrentScreen("landing")
  }

  useEffect(() => {
    if (currentScreen === "destination" && destination.trim()) {
      fetchWeatherData(destination)
      fetchHotelsData(destination)
      fetchPlacesData(destination)
      fetchCuisinesData(destination)
      fetchAdventuresData(destination)
      fetchHistoryData(destination)
      fetchSurpriseContent(destination)

      // Set conversion defaults based on destination
      const defaults = getDestinationDefaults(destination)
      setSelectedToCurrency(defaults.currency)
      setToLanguage(defaults.language)
    }
  }, [currentScreen, destination])

  // Generate Full Itinerary using AI with better JSON formatting
  const generateFullItinerary = async () => {
    setIsGeneratingItinerary(true)
    setItineraryError("")

    try {
      const prompt = `Plan a detailed travel itinerary for ${destination} in JSON format based on:
      - Destination: ${destination}
      - Travelers: ${travelers.adults} adults${travelers.children > 0 ? `, ${travelers.children} children` : ""}
      - Travel dates: ${dateType === "dates" ? travelDates : duration}
      - Budget: ${budget}
      - Departure city: Mumbai (default)

      Return ONLY a valid JSON object with this exact structure:
      {
        "destination": "${destination}",
        "summary": "Brief overview of the trip",
        "flightOptions": [
          {
            "airline": "Airline Name",
            "route": "Mumbai → ${destination}",
            "departure": "Time and date",
            "arrival": "Time and date",
            "price": "₹XX,XXX",
            "duration": "X hours"
          }
        ],
        "hotelRecommendations": [
          {
            "name": "Hotel Name",
            "category": "Luxury/Mid-range/Budget",
            "price": "₹X,XXX per night",
            "rating": 4.5,
            "location": "Area name",
            "highlights": ["Feature 1", "Feature 2"]
          }
        ],
        "dailyItinerary": [
          {
            "day": 1,
            "title": "Day title",
            "theme": "Exploration/Relaxation/Adventure",
            "activities": [
              {
                "time": "09:00 AM",
                "activity": "Activity description",
                "location": "Place name",
                "duration": "2 hours",
                "cost": "₹XXX"
              }
            ]
          }
        ],
        "foodRecommendations": [
          {
            "name": "Restaurant/Dish Name",
            "cuisine": "Cuisine type",
            "location": "Area",
            "mustTry": "Signature dish",
            "priceRange": "₹XXX-XXX",
            "description": "Why it's special"
          }
        ],
        "experiences": [
          {
            "name": "Experience name",
            "type": "Cultural/Adventure/Relaxation",
            "description": "What makes it unique",
            "duration": "X hours",
            "cost": "₹XXX",
            "bestTime": "When to do it"
          }
        ],
        "localInsights": {
          "currency": "Currency info",
          "language": "Local language tips",
          "culture": "Cultural etiquette",
          "transportation": "Getting around tips",
          "safety": "Safety considerations",
          "weather": "Weather advice",
          "shopping": "What to buy and where"
        },
        "budgetBreakdown": {
          "flights": "₹XX,XXX",
          "accommodation": "₹XX,XXX",
          "food": "₹XX,XXX",
          "activities": "₹XX,XXX",
          "transportation": "₹XX,XXX",
          "total": "₹XX,XXX"
        }
      }

      Make it detailed, practical, and engaging for ${travelers.adults + travelers.children} travelers.`

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey) {
        setItineraryError(
          "Google Generative AI API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env file.",
        )
        setIsGeneratingItinerary(false)
        return
      }
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      // Clean and parse JSON
      let jsonText = text.trim()
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      let parsedItinerary
      try {
        parsedItinerary = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("Itinerary JSON parsing error:", parseError)
        // Fallback to raw content display
        parsedItinerary = {
          rawContent: text,
          destination: destination,
          summary: "Custom itinerary generated for your trip",
        }
      }

      setGeneratedItinerary(parsedItinerary)
    } catch (error) {
      console.error("Itinerary generation error:", error)
      setItineraryError("Unable to generate itinerary. Please try again.")
    } finally {
      setIsGeneratingItinerary(false)
    }
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
                {/* From Location Input */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Where are you starting from? 🏠
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your departure city (e.g., Mumbai, Delhi, Bangalore)..."
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white pl-4"
                    />
                  </div>
                </div>
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

                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-3 text-center">
                    <p className="text-amber-800 font-medium">
                      Total: {travelers.adults + travelers.children} traveler
                      {travelers.adults + travelers.children !== 1 ? "s" : ""}
                      {travelers.adults > 0 &&
                        ` (${travelers.adults} adult${travelers.adults !== 1 ? "s" : ""}${
                          travelers.children > 0
                            ? `, ${travelers.children} child${travelers.children !== 1 ? "ren" : ""}`
                            : ""
                        })`}
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
                    disabled={
                      !destination.trim() ||
                      !fromLocation.trim() ||
                      (!travelDates.trim() && !duration.trim()) ||
                      !budget.trim()
                    }
                    className="w-full py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background:
                        destination.trim() &&
                        fromLocation.trim() &&
                        (travelDates.trim() || duration.trim()) &&
                        budget.trim()
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
                    className={`w-3 h-3 rounded-full transition-all ${
                      fromLocation.trim() ? "bg-orange-500" : "bg-orange-200"
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      destination.trim() ? "bg-orange-500" : "bg-orange-200"
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      travelDates.trim() || duration.trim() ? "bg-orange-500" : "bg-orange-200"
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      travelers.adults > 0 ? "bg-orange-500" : "bg-orange-200"
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      budget.trim() ? "bg-orange-500" : "bg-orange-200"
                    }`}
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

      {/* Header with Back Button */}
      <header className="sticky top-0 z-40 p-2 sm:p-4" style={{ backgroundColor: "rgba(255, 183, 77, 0.95)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            onClick={handleBackToLanding}
            variant="ghost"
            className="text-white hover:bg-orange-400 rounded-full text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Search</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="text-center flex-1 px-2">
            <h1 className="text-lg sm:text-2xl font-bold text-white">Exploring {destination} ☀️</h1>
            <p className="text-orange-100 text-xs sm:text-sm">
              {travelers.adults + travelers.children} traveler
              {travelers.adults + travelers.children !== 1 ? "s" : ""} •
              <span className="hidden sm:inline">
                {dateType === "dates" ? travelDates : duration} • {budget}
              </span>
            </p>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {[
              {
                icon: MapIcon,
                label: "Interactive Map",
                action: () => setShowMapModal(true),
              },
              // { icon: Luggage, label: "Plan" },
              {
                icon: RefreshCw,
                label: "Convert",
                action: () => {
                  const defaults = getDestinationDefaults(destination)
                  setSelectedToCurrency(defaults.currency)
                  setToLanguage(defaults.language)
                  setShowConvertModal(true)
                  fetchExchangeRates()
                },
              },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-orange-400 h-8 w-8 sm:h-10 sm:w-10"
                title={item.label}
                onClick={item.action}
              >
                <item.icon className="h-3 sm:h-4 w-3 sm:w-4" />
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
              className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mb-8 rounded-2xl p-2 gap-1"
              style={{
                background: "linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)",
                boxShadow: "0 8px 32px rgba(255, 87, 34, 0.2)",
              }}
            >
              <TabsTrigger
                value="weather"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">🌤️</span>
                <span className="hidden sm:inline">🌤️ Weather</span>
              </TabsTrigger>
              <TabsTrigger
                value="hotels"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">🏨</span>
                <span className="hidden sm:inline">🏨 Hotels</span>
              </TabsTrigger>
              <TabsTrigger
                value="places"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">📍</span>
                <span className="hidden sm:inline">📍 Places</span>
              </TabsTrigger>
              <TabsTrigger
                value="cuisine"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">🍽️</span>
                <span className="hidden sm:inline">🍽️ Cuisine</span>
              </TabsTrigger>
              <TabsTrigger
                value="adventures"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">🏞️</span>
                <span className="hidden sm:inline">🏞️ Adventures</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">📜</span>
                <span className="hidden sm:inline">📜 History</span>
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">🖼️</span>
                <span className="hidden sm:inline">🖼️ Gallery</span>
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="rounded-xl text-white data-[state=active]:bg-white data-[state=active]:text-orange-600 text-xs sm:text-sm"
              >
                <span className="sm:hidden">📋</span>
                <span className="hidden sm:inline">📋 Full Itinerary</span>
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
                    {isLoadingWeather && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                  </CardTitle>
                  {weatherError && <p className="text-orange-100 text-sm mt-2">⚠️ {weatherError}</p>}
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

                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => fetchWeatherData(destination)}
                      disabled={isLoadingWeather}
                      className="rounded-full bg-white text-orange-600 hover:bg-orange-50 font-medium"
                    >
                      {isLoadingWeather ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Weather
                        </>
                      )}
                    </Button>
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
                  <Button
                    onClick={() => fetchHotelsData(destination)}
                    disabled={isLoadingHotels}
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {isLoadingHotels ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Hotels
                  </Button>
                </div>

                {isLoadingHotels ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="rounded-3xl shadow-2xl border-0 overflow-hidden animate-pulse">
                        <div className="h-48 bg-orange-200" />
                        <CardContent className="p-6">
                          <div className="h-6 bg-orange-200 rounded mb-2" />
                          <div className="h-4 bg-orange-200 rounded mb-4" />
                          <div className="h-10 bg-orange-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : hotelsError ? (
                  <div className="text-center py-12">
                    <p className="text-amber-800 text-lg">⚠️ {hotelsError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <Card
                        key={hotel.id}
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
                          {hotel.address && (
                            <p className="text-sm text-amber-700 mb-2 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {hotel.address}
                            </p>
                          )}
                          {hotel.phone && (
                            <p className="text-sm text-amber-700 mb-3 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {hotel.phone}
                            </p>
                          )}
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
                )}
              </div>
            </TabsContent>

            {/* Places Tab */}
            <TabsContent value="places">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button
                    onClick={() => fetchPlacesData(destination)}
                    disabled={isLoadingPlaces}
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {isLoadingPlaces ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Places
                  </Button>
                  <Button
                    onClick={() => setShowMapModal(true)}
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </div>

                {isLoadingPlaces ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="rounded-3xl shadow-2xl border-0 overflow-hidden animate-pulse">
                        <div className="h-48 bg-orange-200" />
                        <CardContent className="p-6">
                          <div className="h-6 bg-orange-200 rounded mb-2" />
                          <div className="h-4 bg-orange-100 rounded mb-4" />
                          <div className="h-10 bg-orange-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : placesError ? (
                  <div className="text-center py-12">
                    <p className="text-amber-800 text-lg">⚠️ {placesError}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {places.map((place) => (
                      <Card
                        key={place.id}
                        className="rounded-3xl shadow-2xl border-0 overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
                          boxShadow: "0 15px 45px rgba(255, 152, 0, 0.2)",
                        }}
                      >
                        <div
                          className="h-48 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${
                              place.image ||
                              `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(place.name)}`
                            })`,
                          }}
                        />
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-amber-900 mb-2">{place.name}</h3>
                          <Badge className="mb-3 bg-orange-200 text-orange-800">{place.category}</Badge>
                          {place.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="h-4 w-4 text-yellow-600 fill-current" />
                              <span className="font-semibold text-amber-800">{place.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-green-700 mt-0.5 flex-shrink-0" />
                              <span className="text-amber-800 text-sm">{place.address}</span>
                            </div>
                            {place.distance && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-700" />
                                <span className="text-amber-800 text-sm">{place.distance}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            className="w-full rounded-full text-white font-bold"
                            style={{
                              background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                            }}
                            onClick={() => setShowMapModal(true)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Cuisine Tab */}
            <TabsContent value="cuisine">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button
                    onClick={() => fetchCuisinesData(destination)}
                    disabled={isLoadingCuisines}
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {isLoadingCuisines ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Cuisines
                  </Button>
                </div>

                {isLoadingCuisines ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="rounded-3xl shadow-2xl border-0 overflow-hidden animate-pulse">
                        <div className="h-40 bg-orange-200" />
                        <CardContent className="p-6">
                          <div className="h-6 bg-orange-200 rounded mb-2" />
                          <div className="h-4 bg-orange-100 rounded mb-4" />
                          <div className="h-10 bg-orange-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : cuisinesError ? (
                  <div className="text-center py-12">
                    <p className="text-amber-800 text-lg">⚠️ {cuisinesError}</p>
                  </div>
                ) : (
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
                          {dish.description && <p className="text-sm text-amber-700 mb-3">{dish.description}</p>}
                          {dish.restaurant && (
                            <p className="text-sm text-amber-600 mb-2 font-medium">📍 {dish.restaurant}</p>
                          )}
                          {dish.price && <p className="text-lg font-bold text-orange-600 mb-3">{dish.price}</p>}
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
                )}
              </div>
            </TabsContent>

            {/* Adventures Tab */}
            <TabsContent value="adventures">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button
                    onClick={() => fetchAdventuresData(destination)}
                    disabled={isLoadingAdventures}
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {isLoadingAdventures ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Adventures
                  </Button>
                </div>

                {isLoadingAdventures ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="rounded-3xl shadow-2xl border-0 overflow-hidden animate-pulse">
                        <div className="h-48 bg-orange-200" />
                        <CardContent className="p-6">
                          <div className="h-6 bg-orange-200 rounded mb-2" />
                          <div className="h-4 bg-orange-100 rounded mb-4" />
                          <div className="h-10 bg-orange-200 rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : adventuresError ? (
                  <div className="text-center py-12">
                    <p className="text-amber-800 text-lg">⚠️ {adventuresError}</p>
                  </div>
                ) : (
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
                        <div
                          className="h-48 bg-cover bg-center"
                          style={{ backgroundImage: `url(${adventure.image})` }}
                        />
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{adventure.name}</h3>
                          {adventure.description && (
                            <p className="text-orange-100 text-sm mb-3">{adventure.description}</p>
                          )}
                          <div className="space-y-2 mb-4 text-white">
                            <div className="flex items-center gap-2">
                              <Mountain className="h-4 w-4" />
                              <span>Difficulty: {adventure.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Duration: {adventure.duration}</span>
                            </div>
                            {adventure.price && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>{adventure.price}</span>
                              </div>
                            )}
                            {adventure.bestTime && (
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                <span>Best time: {adventure.bestTime}</span>
                              </div>
                            )}
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
                )}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button
                    onClick={() => fetchHistoryData(destination)}
                    disabled={isLoadingHistory}
                    variant="outline"
                    className="rounded-full bg-white border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {isLoadingHistory ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh History
                  </Button>
                </div>

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
                      {isLoadingHistory && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
                    </CardTitle>
                    {historyError && <p className="text-orange-100 text-sm mt-2">⚠️ {historyError}</p>}
                  </CardHeader>
                  <CardContent className="p-8">
                    {isLoadingHistory ? (
                      <div className="space-y-6">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                            <div className="h-6 bg-orange-200 rounded mb-3" />
                            <div className="space-y-2">
                              <div className="h-4 bg-orange-100 rounded" />
                              <div className="h-4 bg-orange-100 rounded" />
                              <div className="h-4 bg-orange-100 rounded w-3/4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {historyContent.map((history, index) => (
                          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                            {history.image && (
                              <div
                                className="h-32 sm:h-48 bg-cover bg-center rounded-xl mb-4"
                                style={{
                                  backgroundImage: `url(${history.image})`,
                                }}
                              />
                            )}
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-bold text-amber-900">{history.title}</h3>
                              {history.period && (
                                <Badge className="bg-orange-200 text-orange-800">{history.period}</Badge>
                              )}
                            </div>
                            <p className="text-amber-800 leading-relaxed mb-3">{history.content}</p>
                            {history.significance && (
                              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 border-l-4 border-orange-400">
                                <p className="text-amber-900 font-medium text-sm">
                                  <strong>Historical Significance:</strong> {history.significance}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.length > 0
                  ? galleryImages.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        style={{
                          background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
                          boxShadow: "0 8px 32px rgba(255, 152, 0, 0.2)",
                        }}
                      >
                        <img
                          src={photo.src.medium || "/placeholder.svg"}
                          alt={photo.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))
                  : Array.from({ length: 12 }).map((_, index) => (
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
                          style={{
                            backgroundImage: `url(/placeholder.svg?height=300&width=300&text=Gallery+${index + 1})`,
                          }}
                        />
                      </div>
                    ))}
              </div>
            </TabsContent>

            {/* Full Itinerary Tab */}
            <TabsContent value="itinerary">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Button
                    onClick={generateFullItinerary}
                    disabled={isGeneratingItinerary}
                    className="px-8 py-4 text-lg rounded-2xl shadow-2xl text-white font-bold"
                    style={{
                      background: isGeneratingItinerary
                        ? "linear-gradient(135deg, #FFCC80 0%, #FFB74D 100%)"
                        : "linear-gradient(135deg, #FF8A65 0%, #FF7043 50%, #FF5722 100%)",
                      boxShadow: "0 8px 32px rgba(255, 87, 34, 0.3)",
                    }}
                  >
                    {isGeneratingItinerary ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Generating Your Perfect Itinerary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6 mr-3" />
                        Generate Complete Itinerary
                      </>
                    )}
                  </Button>

                  {itineraryError && <p className="text-red-600 mt-4 text-lg">⚠️ {itineraryError}</p>}
                </div>

                {generatedItinerary && (
                  <div className="space-y-8">
                    {/* Itinerary Header */}
                    <Card
                      className="rounded-3xl shadow-2xl border-0"
                      style={{
                        background: "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                        boxShadow: "0 20px 60px rgba(255, 152, 0, 0.3)",
                      }}
                    >
                      <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-white mb-2">
                          🌟 Your Perfect {destination} Itinerary
                        </CardTitle>
                        <p className="text-orange-100 text-lg">
                          {travelers.adults + travelers.children} traveler
                          {travelers.adults + travelers.children !== 1 ? "s" : ""} •
                          {dateType === "dates" ? travelDates : duration} • {budget}
                        </p>
                        {generatedItinerary.summary && (
                          <p className="text-orange-100 mt-2">{generatedItinerary.summary}</p>
                        )}
                      </CardHeader>
                    </Card>

                    {/* Export Options */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                      <Button
                        onClick={emailItinerary}
                        disabled={!generatedItinerary}
                        className="rounded-full bg-white text-orange-600 border-2 border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                      >
                        📧 Email Itinerary
                      </Button>
                      <Button
                        onClick={exportToPDF}
                        disabled={!generatedItinerary}
                        className="rounded-full bg-white text-orange-600 border-2 border-orange-300 hover:bg-orange-50 disabled:opacity-50"
                      >
                        📱 Export to File
                      </Button>
                    </div>

                    {/* Itinerary Content */}
                    {generatedItinerary.rawContent ? (
                      <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                        <CardContent className="p-8">
                          <pre className="whitespace-pre-wrap text-amber-900 leading-relaxed">
                            {generatedItinerary.rawContent}
                          </pre>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-8">
                        {/* Flight Options */}
                        {generatedItinerary.flightOptions && generatedItinerary.flightOptions.length > 0 && (
                          <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                            <CardHeader>
                              <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                ✈️ Flight Options
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                {generatedItinerary.flightOptions.map((flight: any, index: number) => (
                                  <div key={index} className="bg-orange-50 rounded-2xl p-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="font-bold text-amber-900 mb-2">{flight.airline}</h3>
                                        <p className="text-amber-800">{flight.route}</p>
                                        <p className="text-amber-800">
                                          <strong>Departure:</strong> {flight.departure}
                                        </p>
                                        <p className="text-amber-800">
                                          <strong>Arrival:</strong> {flight.arrival}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-2xl font-bold text-orange-600">{flight.price}</p>
                                        <p className="text-amber-700">Duration: {flight.duration}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Hotel Recommendations */}
                        {generatedItinerary.hotelRecommendations &&
                          generatedItinerary.hotelRecommendations.length > 0 && (
                            <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                              <CardHeader>
                                <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                  🏨 Hotel Recommendations
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {generatedItinerary.hotelRecommendations.map((hotel: any, index: number) => (
                                    <div key={index} className="bg-orange-50 rounded-2xl p-6">
                                      <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-amber-900">{hotel.name}</h3>
                                        <Badge className="bg-orange-200 text-orange-800">{hotel.category}</Badge>
                                      </div>
                                      <p className="text-amber-800 mb-2">📍 {hotel.location}</p>
                                      <div className="flex items-center gap-2 mb-3">
                                        <Star className="h-4 w-4 text-yellow-600 fill-current" />
                                        <span className="font-semibold text-amber-800">{hotel.rating}</span>
                                      </div>
                                      <p className="text-2xl font-bold text-orange-600 mb-3">{hotel.price}</p>
                                      {hotel.highlights && (
                                        <div className="flex flex-wrap gap-1">
                                          {hotel.highlights.map((highlight: string, i: number) => (
                                            <Badge key={i} className="text-xs bg-yellow-200 text-yellow-800">
                                              {highlight}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                        {/* Daily Itinerary */}
                        {generatedItinerary.dailyItinerary && generatedItinerary.dailyItinerary.length > 0 && (
                          <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                            <CardHeader>
                              <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                📅 Day-by-Day Itinerary
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                {generatedItinerary.dailyItinerary.map((day: any, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6"
                                  >
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="text-xl font-bold text-amber-900">
                                        Day {day.day}: {day.title}
                                      </h3>
                                      {day.theme && (
                                        <Badge className="bg-orange-200 text-orange-800">{day.theme}</Badge>
                                      )}
                                    </div>
                                    <div className="space-y-3">
                                      {day.activities?.map((activity: any, actIndex: number) => (
                                        <div key={actIndex} className="flex items-start gap-3 bg-white rounded-xl p-4">
                                          <Clock className="h-5 w-5 text-orange-600 mt-1" />
                                          <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                              <p className="font-semibold text-amber-900">{activity.time}</p>
                                              {activity.cost && (
                                                <span className="text-orange-600 font-medium">{activity.cost}</span>
                                              )}
                                            </div>
                                            <p className="text-amber-800 mb-1">{activity.activity}</p>
                                            {activity.location && (
                                              <p className="text-sm text-amber-700 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {activity.location}
                                              </p>
                                            )}
                                            {activity.duration && (
                                              <p className="text-sm text-amber-600 mt-1">
                                                Duration: {activity.duration}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Food Recommendations */}
                        {generatedItinerary.foodRecommendations &&
                          generatedItinerary.foodRecommendations.length > 0 && (
                            <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                              <CardHeader>
                                <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                  🍽️ Food & Restaurant Recommendations
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {generatedItinerary.foodRecommendations.map((restaurant: any, index: number) => (
                                    <div key={index} className="bg-orange-50 rounded-2xl p-6">
                                      <h3 className="font-bold text-amber-900 mb-2">{restaurant.name}</h3>
                                      <p className="text-amber-800 mb-2">🍴 {restaurant.cuisine}</p>
                                      <p className="text-amber-700 mb-2">📍 {restaurant.location}</p>
                                      {restaurant.priceRange && (
                                        <p className="text-orange-600 font-semibold mb-2">{restaurant.priceRange}</p>
                                      )}
                                      {restaurant.mustTry && (
                                        <p className="text-amber-900 font-medium mb-2">
                                          <strong>Must Try:</strong> {restaurant.mustTry}
                                        </p>
                                      )}
                                      <p className="text-sm text-amber-700">{restaurant.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                        {/* Experiences */}
                        {generatedItinerary.experiences && generatedItinerary.experiences.length > 0 && (
                          <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                            <CardHeader>
                              <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                🎯 Special Experiences
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid md:grid-cols-2 gap-4">
                                {generatedItinerary.experiences.map((experience: any, index: number) => (
                                  <div key={index} className="bg-orange-50 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                      <h3 className="font-bold text-amber-900">{experience.name}</h3>
                                      <Badge className="bg-orange-200 text-orange-800">{experience.type}</Badge>
                                    </div>
                                    <p className="text-amber-800 mb-3">{experience.description}</p>
                                    <div className="space-y-2 text-sm text-amber-700">
                                      <p>
                                        <strong>Duration:</strong> {experience.duration}
                                      </p>
                                      <p>
                                        <strong>Cost:</strong> {experience.cost}
                                      </p>
                                      <p>
                                        <strong>Best Time:</strong> {experience.bestTime}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Local Insights */}
                        {generatedItinerary.localInsights && (
                          <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                            <CardHeader>
                              <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                💡 Local Insights & Tips
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid md:grid-cols-2 gap-6">
                                {Object.entries(generatedItinerary.localInsights).map(([key, value]: [string, any]) => (
                                  <div
                                    key={key}
                                    className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4"
                                  >
                                    <h4 className="font-bold text-amber-900 mb-2 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </h4>
                                    <p className="text-amber-800 text-sm leading-relaxed">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Budget Breakdown */}
                        {generatedItinerary.budgetBreakdown && (
                          <Card className="rounded-3xl shadow-2xl border-0 bg-white">
                            <CardHeader>
                              <CardTitle className="text-2xl text-amber-900 flex items-center gap-2">
                                💰 Budget Breakdown
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                  {Object.entries(generatedItinerary.budgetBreakdown).map(
                                    ([key, value]: [string, any]) => (
                                      <div key={key} className="flex justify-between items-center py-2">
                                        <span className="font-medium text-emerald-900 capitalize">
                                          {key.replace(/([A-Z])/g, " $1").trim()}:
                                        </span>
                                        <span
                                          className={`font-bold ${
                                            key === "total" ? "text-2xl text-emerald-700" : "text-emerald-800"
                                          }`}
                                        >
                                          {value}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Big Floating Surprise Button */}
      <Button
        onClick={() => setShowSurprisePopup(true)}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 rounded-full w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 shadow-2xl animate-bounce text-white font-bold text-xs sm:text-sm lg:text-lg z-50"
        style={{
          background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)",
          boxShadow: "0 12px 40px rgba(255, 107, 53, 0.4)",
        }}
        title="Surprise Me!"
      >
        <div className="flex flex-col items-center">
          <Sparkles className="h-4 sm:h-6 lg:h-8 w-4 sm:w-6 lg:w-8 mb-1" />
          <span className="text-xs">Surprise!</span>
        </div>
      </Button>
      {/* Big Surprise Popup */}
      <Dialog open={showSurprisePopup} onOpenChange={setShowSurprisePopup}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 p-0"
          style={{
            background:
              "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 50%, #FFB74D 100%)",
            boxShadow: "0 25px 80px rgba(255, 152, 0, 0.4)",
          }}
        >
          <div className="relative">
            <div className="text-center p-4 sm:p-8 pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Sparkles className="h-12 sm:h-16 w-12 sm:w-16 text-yellow-500 animate-pulse" />
                  <Heart className="absolute -top-2 -right-2 h-4 sm:h-6 w-4 sm:w-6 text-red-500 animate-bounce" />
                </div>
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2">
                  {surpriseContent?.title || "Hidden Gem Discovered! ✨"}
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="px-4 sm:px-8 pb-4 sm:pb-8 max-h-[60vh] overflow-y-auto">
              {/* Surprise content with scrollable area */}
              {isLoadingSurprise ? (
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-6 animate-pulse">
                  <div className="h-32 sm:h-48 bg-orange-200 rounded-xl mb-4" />
                  <div className="h-6 bg-orange-200 rounded mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-orange-100 rounded" />
                    <div className="h-4 bg-orange-100 rounded" />
                    <div className="h-4 bg-orange-100 rounded w-3/4" />
                  </div>
                  <div className="h-10 bg-orange-200 rounded" />
                </div>
              ) : surpriseError ? (
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-6">
                  <p className="text-amber-800 text-center">
                    ⚠️ {surpriseError}
                  </p>
                </div>
              ) : surpriseContent ? (
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-6">
                  <div
                    className="h-32 sm:h-48 bg-cover bg-center rounded-xl mb-4"
                    style={{ backgroundImage: `url(${surpriseContent.image})` }}
                  />
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-5 sm:h-6 w-5 sm:w-6 text-orange-600" />
                    {surpriseContent.place}
                  </h3>
                  {surpriseContent.category && (
                    <Badge className="mb-3 bg-orange-200 text-orange-800">
                      {surpriseContent.category}
                    </Badge>
                  )}
                  <p className="text-amber-800 leading-relaxed mb-4 text-sm sm:text-base">
                    {surpriseContent.description}
                  </p>
                  {surpriseContent.bestTime && (
                    <p className="text-amber-700 mb-4 text-sm sm:text-base">
                      <strong>Best time to visit:</strong>{" "}
                      {surpriseContent.bestTime}
                    </p>
                  )}
                  <div
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3 sm:p-4 border-l-4"
                    style={{ borderColor: "#FF9800" }}
                  >
                    <p className="text-amber-900 font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <Gift className="h-4 sm:h-5 w-4 sm:w-5" />
                      Pro Tip: {surpriseContent.tip}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 rounded-full text-white font-bold py-3 text-sm sm:text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                  }}
                >
                  <Camera className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Add to My Trip
                </Button>
                <Button
                  className="flex-1 rounded-full text-white font-bold py-3 text-sm sm:text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)",
                  }}
                >
                  <MapPin className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog> 
      {/* Interactive Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
              <MapIcon className="h-6 w-6" />
              Interactive Map - {destination}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6">
            {destinationCoords ? (
              <MapComponent center={destinationCoords} zoom={13} width={850} height={500} />
            ) : (
              <div
                id="map"
                className="w-full h-full rounded-2xl"
                style={{ minHeight: "500px", backgroundColor: "#f0f0f0" }}
              >
                <div className="flex items-center justify-center h-full text-amber-800">
                  <div className="text-center">
                    <MapIcon className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                    <p className="text-lg font-semibold mb-2">Interactive Map</p>
                    <p className="text-sm">
                      Map will load here showing {destination} with markers for hotels and places of interest.
                    </p>
                    {destinationCoords && (
                      <p className="text-xs mt-2 text-amber-600">
                        Coordinates: {destinationCoords.lat.toFixed(4)}, {destinationCoords.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Currency & Language Converter Modal */}
      <Dialog open={showConvertModal} onOpenChange={setShowConvertModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 p-0">
          <div
            className="p-6"
            style={{
              background: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
            }}
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                <RefreshCw className="h-6 w-6" />
                Currency & Language Converter
              </DialogTitle>
              <p className="text-amber-700">Convert currencies and translate text for your trip to {destination}</p>
            </DialogHeader>

            {/* Currency Converter */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xl font-semibold text-amber-900">
                Currency Converter
                {isLoadingRates && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </h4>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-amber-700 text-sm font-bold mb-2">From</label>
                  <select
                    value={selectedFromCurrency}
                    onChange={(e) => setSelectedFromCurrency(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {exchangeRates &&
                      Object.keys(exchangeRates.conversion_rates).map((currencyCode) => (
                        <option key={currencyCode} value={currencyCode}>
                          {currencyCode}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-amber-700 text-sm font-bold mb-2">To</label>
                  <select
                    value={selectedToCurrency}
                    onChange={(e) => setSelectedToCurrency(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {exchangeRates &&
                      Object.keys(exchangeRates.conversion_rates).map((currencyCode) => (
                        <option key={currencyCode} value={currencyCode}>
                          {currencyCode}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-amber-700 text-sm font-bold mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amountToConvert}
                    onChange={(e) => setAmountToConvert(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-amber-700 text-sm font-bold mb-2">Converted Amount</label>
                  <Input
                    type="text"
                    value={convertedAmount}
                    readOnly
                    placeholder="Converted amount"
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <Button
                onClick={convertCurrency}
                disabled={!amountToConvert}
                className="w-full rounded-full bg-white text-orange-600 hover:bg-orange-50 font-medium"
              >
                Convert
              </Button>
            </div>

            {/* Language Translator */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-amber-900">
                Language Translator
                {isTranslating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </h4>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-amber-700 text-sm font-bold mb-2">From</label>
                  <select
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="th">Thai</option>
                    <option value="vi">Vietnamese</option>
                    <option value="tr">Turkish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="da">Danish</option>
                    <option value="no">Norwegian</option>
                    <option value="fi">Finnish</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-amber-700 text-sm font-bold mb-2">To</label>
                  <select
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh">Chinese</option>
                    <option value="ar">Arabic</option>
                    <option value="th">Thai</option>
                    <option value="vi">Vietnamese</option>
                    <option value="tr">Turkish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="da">Danish</option>
                    <option value="no">Norwegian</option>
                    <option value="fi">Finnish</option>
                  </select>
                </div>
              </div>

              <label className="block text-amber-700 text-sm font-bold mb-2">Text to Translate</label>
              <Input
                placeholder="Enter text to translate"
                value={textToTranslate}
                onChange={(e) => setTextToTranslate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label className="block text-amber-700 text-sm font-bold mb-2">Translated Text</label>
              <Input
                type="text"
                value={translatedText}
                readOnly
                placeholder="Translated text"
                className="shadow appearance-none border rounded w-full py-3 px-3 text-amber-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <Button
                onClick={translateText}
                disabled={!textToTranslate}
                className="w-full rounded-full bg-white text-orange-600 hover:bg-orange-50 font-medium"
              >
                Translate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
