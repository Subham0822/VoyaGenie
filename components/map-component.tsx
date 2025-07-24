import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom?: number;
  width?: number;
  height?: number;
}

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

export default function MapComponent({
  center,
  zoom = 13,
  width = 600,
  height = 400,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (!GEOAPIFY_API_KEY) {
      console.error(
        "Geoapify API key is missing. Please set NEXT_PUBLIC_GEOAPIFY_API_KEY in your .env file."
      );
      return;
    }
    // Initialize MapLibre map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          geoapify: {
            type: "raster",
            tiles: [
              `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${GEOAPIFY_API_KEY}`,
            ],
            tileSize: 256,
            attribution:
              '© <a href="https://www.geoapify.com/">Geoapify</a> contributors',
          },
        },
        layers: [
          {
            id: "geoapify",
            type: "raster",
            source: "geoapify",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [center.lng, center.lat],
      zoom,
    });

    mapRef.current = map;

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width,
        height,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 16px #ccc",
      }}
    />
  );
}
