import { google } from "@ai-sdk/google";
import { ollama } from "ollama-ai-provider";
import { generateText } from "ai";
import { type NextApiResponse, type NextApiRequest } from "next";

// import prompts from "../../old_prompts.json";
import { categories } from "~/categories.json";

import { z } from "zod";

import { env } from "~/env";

import { NearbyPlacesSchema, placeDetailsSchema } from "~/schemas/schemas";

const messageSchema = z.object({
  role: z.enum(["user", "system", "assistant"]), // TODO: make this whatever it needs to be
  content: z.string(),
});

export const messageListSchema = z.array(messageSchema);

const reqBodySchema = z.object({ messages: messageListSchema });

const placeTypes = z.object({
  includedTypes: z.array(z.string()),
});

const suggestionsSchema = z.object({
  places: z.array(z.object({ name: z.string(), id: z.string() })),
});

const responseListSchema = z.array(
  z.object({
    name: z.string(),
    url: z.string(),
    photo: z.string(),
  }),
);

export const responseSchema = z.object({ suggestions: responseListSchema });
type ResponseList = z.infer<typeof responseListSchema>;
type Response = z.infer<typeof responseSchema>;

const fetchNearbyPlaces = async (categories: string[]) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Goog-Api-Key", env.GOOGLE_GENERATIVE_AI_API_KEY);
  myHeaders.append(
    "X-Goog-FieldMask",
    "places.displayName.text,places.id,places.types,places.rating,places.googleMapsUri,places.regularOpeningHours.openNow,places.businessStatus,places.priceLevel,places.takeout,places.dineIn,places.curbsidePickup,places.reservable,places.servesLunch,places.servesDinner,places.servesBeer,places.servesWine,places.servesBrunch,places.editorialSummary.text,places.reviews.text.text,places.outdoorSeating,places.liveMusic,places.menuForChildren,places.servesCocktails,places.servesDessert,places.servesCoffee,places.allowsDogs,places.restroom,places.goodForGroups,places.goodForWatchingSports,places.paymentOptions,places.parkingOptions,places.accessibilityOptions",
    // "places.displayName.text",
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
            latitude: 43.726992,
            longitude: -79.33126,
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

const fetchPlaceDetails = async (placeId: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Goog-Api-Key", env.GOOGLE_GENERATIVE_AI_API_KEY);
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

const fetchPlacePhotos = async (uri: string) => {
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
  return (
    "data:" +
    response.headers.get("Content-Type") +
    ";base64," +
    Buffer.from(await response.arrayBuffer()).toString("base64")
  );
};

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  console.log("backend called");
  const { messages } = reqBodySchema.parse(req.body);

  const user_query = messages.filter((m) => m.role === "user")[
    messages.length - 1
  ]?.content;

  console.log("gets here");
  const generatedPlacesQuery = await generateText({
    // model: google("models/gemini-1.5-pro-latest"),
    model: ollama("gemma2:27b"),
    prompt: `Based on this query "${user_query}" choose all the applicable category types only from the following json file. ${JSON.stringify(categories)}`,
    system: `Your response no matter the user query should always be in following json format. format: {"includedTypes": [list of types here]}`,
  });
  console.log("generatedPlacesQuery", generatedPlacesQuery.text);

  const query = placeTypes.parse(
    JSON.parse(
      generatedPlacesQuery.text.replace(/^```json\n([\s\S]*)\n```$/m, "$1"),
    ),
  );

  const { places } = await fetchNearbyPlaces(query.includedTypes);

  const placePrompt = `Given the following descprtion of 20 locations, provide suggestion for only one location or multiple based on the user query which is ${messages[0]!.content}.Your response should be a json with following schema: {"places":[{"id":"appropriate place id","name":"name of the place"}]} \n ${JSON.stringify(places)}`;
  const placeSuggestions = await generateText({
    // model: google("models/gemini-1.5-pro-latest"),
    model: ollama("gemma2:27b"),
    prompt: placePrompt,
  });
  const suggestions = suggestionsSchema.parse(
    JSON.parse(
      placeSuggestions.text.replace(/^```json\n([\s\S]*)\n```$/m, "$1"),
    ),
  );
  const processedSuggestions: ResponseList = [];
  for (const suggestion of suggestions.places) {
    const details = await fetchPlaceDetails(suggestion.id);
    console.log("details", JSON.stringify(details));
    const downloadedPhoto =
      details.photos && (await fetchPlacePhotos(details.photos[0]?.name ?? ""));
    processedSuggestions.push({
      name: details.displayName.text,
      url: details.googleMapsUri,
      photo: downloadedPhoto ?? "", //put placeholder image here
    });
  }
  console.log("everything is processed");
  res.status(200).json({ suggestions: processedSuggestions });
}
