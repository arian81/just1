import { env } from "../env";
import { NearbyPlacesSchema, placeDetailsSchema } from "./schemas";
import { Storage } from "@google-cloud/storage";
import { v7 } from "uuid";
import type { Location } from "~/lib/types";

export const fetchNearbyPlaces = async (
  categories: string[],
  location: Location,
) => {
  console.log("categories", categories);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Goog-Api-Key", String(env.GOOGLE_GENERATIVE_AI_API_KEY));
  myHeaders.append(
    "X-Goog-FieldMask",
    // "places.displayName.text,places.id,places.types,places.rating,places.googleMapsUri,places.regularOpeningHours.openNow,places.businessStatus,places.priceLevel,places.takeout,places.dineIn,places.curbsidePickup,places.reservable,places.servesLunch,places.servesDinner,places.servesBeer,places.servesWine,places.servesBrunch,places.editorialSummary.text,places.reviews.text.text,places.outdoorSeating,places.liveMusic,places.menuForChildren,places.servesCocktails,places.servesDessert,places.servesCoffee,places.allowsDogs,places.restroom,places.goodForGroups,places.goodForWatchingSports,places.paymentOptions,places.parkingOptions,places.accessibilityOptions",
    "places.displayName.text,places.id,places.types,places.rating,places.googleMapsUri,places.regularOpeningHours.openNow,places.businessStatus,places.priceLevel,places.editorialSummary.text,places.reviews.text.text",
  );

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      includedTypes: categories,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 5000.0,
        },
      },
    }),
  };

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    requestOptions,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return NearbyPlacesSchema.parse(await response.json());
};

export const fetchPlaceDetails = async (placeId: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Goog-Api-Key", String(env.GOOGLE_GENERATIVE_AI_API_KEY));
  myHeaders.append(
    "X-Goog-FieldMask",
    "displayName.text,photos.name,googleMapsUri",
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    requestOptions,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return placeDetailsSchema.parse(await response.json());
};

export const fetchPlacePhotos = async (uri: string): Promise<string> => {
  if (uri === "") {
    return "";
  }

  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(
    `https://places.googleapis.com/v1/${uri}/media?key=${env.GOOGLE_GENERATIVE_AI_API_KEY}&maxHeightPx=500&maxWidthPx=500`,
    requestOptions,
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("Content-Type") ?? "image/jpeg";

  // Initialize Google Cloud Storage
  const storage = new Storage({
    projectId: env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: env.BUCKET_SA_EMAIL,
      private_key: env.BUCKET_SA_PRIVATE_KEY,
    },
  });

  const bucketName = "just1-place-images";
  const bucket = storage.bucket(bucketName);

  // Generate a unique filename
  const filename = `${v7()}.${contentType.split("/")[1]}`;

  // Upload the image to Google Cloud Storage
  const file = bucket.file(filename);
  await file.save(buffer, {
    metadata: {
      contentType: contentType,
    },
  });

  // Make the file publicly accessible
  await file.makePublic();

  // Return the public URL of the uploaded image
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
};
