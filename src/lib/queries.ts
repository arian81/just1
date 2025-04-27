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
    // Consider logging response.status and response.statusText here
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  try {
    return NearbyPlacesSchema.parse(await response.json());
  } catch (e) {
    console.error("Failed to parse NearbyPlacesSchema", e);
    // Depending on requirements, you might want to throw or return an empty/error state
    throw e;
  }
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
    // Consider logging response.status and response.statusText here
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  try {
    return placeDetailsSchema.parse(await response.json());
  } catch (e) {
    console.error("Failed to parse placeDetailsSchema", e);
    // Depending on requirements, you might want to throw or return an empty/error state
    throw e;
  }
};

export const fetchPlacePhotos = async (uri: string): Promise<string> => {
  if (uri === "") {
    console.log(
      "Empty URI provided for fetchPlacePhotos, returning empty string.",
    );
    return "";
  }

  const requestOptions = {
    method: "GET",
  };

  let response: Response;
  const photoUrl = `https://places.googleapis.com/v1/${uri}/media?key=${env.GOOGLE_GENERATIVE_AI_API_KEY}&maxHeightPx=500&maxWidthPx=500`;

  console.log("Attempting to fetch place photo from:", photoUrl);
  try {
    response = await fetch(photoUrl, requestOptions);
    console.log("Fetch response status:", response.status, response.statusText);
  } catch (error) {
    console.error("Error during fetch call for place photo:", error);
    // Rethrow or return empty string depending on how you want to handle fetch errors
    // throw error; // Or return "" if you prefer graceful failure
    return "";
  }

  if (!response.ok) {
    console.error(
      `Failed to fetch place photo. Status: ${response.status} ${response.statusText}`,
    );
    // Optionally log response body if available and not too large
    // const errorBody = await response.text();
    // console.error("Error response body:", errorBody);
    // Depending on requirements, throw or return empty string
    // throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    return ""; // Graceful failure
  }

  let buffer: Buffer;
  let contentType: string | null;
  try {
    console.log("Attempting to read response body as ArrayBuffer...");
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    contentType = response.headers.get("Content-Type");
    console.log(
      `Successfully read buffer (${buffer.length} bytes), content type: ${contentType}`,
    );
    if (!contentType) {
      console.warn(
        "Content-Type header missing from response, defaulting to image/jpeg",
      );
      contentType = "image/jpeg";
    }
  } catch (error) {
    console.error(
      "Error processing response body (arrayBuffer/Buffer conversion):",
      error,
    );
    return ""; // Or rethrow
  }

  try {
    console.log("Initializing Google Cloud Storage client...");
    // Initialize Google Cloud Storage
    const storage = new Storage({
      projectId: env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: env.BUCKET_SA_EMAIL,
        private_key: env.BUCKET_SA_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Ensure newline characters are correctly interpreted if stored in env var
      },
    });

    const bucketName = "just1-place-images";
    const bucket = storage.bucket(bucketName);

    // Generate a unique filename
    const extension = contentType.split("/")[1] ?? "jpg"; // Use extension from content type, default to jpg
    const filename = `${v7()}.${extension}`;

    console.log(
      `Attempting to upload to GCS: bucket=${bucketName}, filename=${filename}, contentType=${contentType}`,
    );
    // Upload the image to Google Cloud Storage
    const file = bucket.file(filename);
    await file.save(buffer, {
      metadata: {
        contentType: contentType,
      },
      public: true, // Make the file publicly accessible directly on upload
      // predefinedAcl: 'publicRead' // Alternative way to make public
    });

    // The file.makePublic() call might be redundant if public:true is set in save options,
    // but it doesn't hurt to leave it as a fallback or explicit confirmation.
    // console.log("Making file public...");
    // await file.makePublic(); // Usually done automatically with public: true or predefinedAcl

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    console.log("Successfully uploaded image to GCS:", publicUrl);
    // Return the public URL of the uploaded image
    return publicUrl;
  } catch (error) {
    console.error("Error during Google Cloud Storage operation:", error);
    // Rethrow or return empty string depending on requirements
    // throw error;
    return ""; // Graceful failure
  }
};
