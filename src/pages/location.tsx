import type { NextPage } from "next";
import React, { useState, useEffect, use } from "react";
import { MapPin, Loader } from "lucide-react";
import { api } from "~/utils/api";

interface Location {
  latitude: number;
  longitude: number;
}

const TestPage: NextPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { mutateAsync } = api.location.saveLocation.useMutation();
  const [longitude, setLongitude] = useState<number | null>(null);

  //Get user current location
  // useEffect(() => {
  //   const locationInterval = setInterval(() => {
  //     if ("geolocation" in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position: GeolocationPosition) => {
  //           console.log("position", position);
  //           setLocation({
  //             latitude: position.coords.latitude,
  //             longitude: position.coords.longitude,
  //           });
  //           setLoading(false);
  //         },
  //         (error: GeolocationPositionError) => {
  //           setError(error.message);
  //           setLoading(false);
  //         },
  //       );
  //     } else {
  //       setError("Geolocation is not supported by your browser");
  //       setLoading(false);
  //     }
  //   }, 1000);
  //   return () => clearInterval(locationInterval);
  // }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          console.log("position", position);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (error: GeolocationPositionError) => {
          setError(error.message);
          setLoading(false);
        },
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  }, []);

  // Send user location to the server
  useEffect(() => {
    const saveLocation = async () => {
      if (location) {
        try {
          const data = await mutateAsync({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          console.log("sent data");
          // setLongitude(data.longitude);
        } catch (error) {
          console.error(error);
        }
      }
    };

    saveLocation().catch((error) => {
      console.error(error);
    });
  }, [location, mutateAsync]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Geolocation App
        </h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="mr-2 animate-spin text-blue-500" />
            <p>Getting your location...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : location ? (
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-blue-500" size={32} />
            <p className="mb-2">Your current location:</p>
            <p className="font-semibold">
              Latitude: {location.latitude.toFixed(6)}
            </p>
            <p className="font-semibold">
              Longitude: {location.longitude.toFixed(6)}
            </p>
            {/* <div className="bg-red-500">
              {getNearbyRestaurants(location.latitude, location.longitude)}
            </div> */}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TestPage;
