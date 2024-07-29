import { google } from "@ai-sdk/google";
// import { ollama } from "ollama-ai-provider";
import { generateText } from "ai";
import { type NextApiResponse, type NextApiRequest } from "next";
import { categories } from "~/categories.json";
// import simulatedPlaces from "~/simulated_response.json";
import { placeTypes, reqBodySchema, suggestionsSchema } from "~/lib/schemas";
import {
  fetchNearbyPlaces,
  fetchPlaceDetails,
  fetchPlacePhotos,
} from "~/lib/queries";
import type { Response, ResponseList } from "~/lib/types";

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  console.log("req.body", req.body);
  const { messages, location } = reqBodySchema.parse(req.body);
  const current_query = messages
    .filter((m) => m.role === "user")
    .at(-1)?.content;
  // filter out the last message which is the current query
  const previous_queries = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .slice(0, -1);

  const generatedPlacesQuery = await generateText({
    model: google("models/gemini-1.5-pro-latest"),
    prompt:
      previous_queries.length > 0
        ? `Based on this query "${current_query}" choose all the applicable category types only from the following json file. In case the context of user's previous quries are needed here are the previous quries: ${previous_queries.join("\n")} \n\n categories: \n ${JSON.stringify(categories)}`
        : `Based on this query "${current_query}" choose all the applicable category types only from the following json file. ${JSON.stringify(categories)}`,
    system: `Your response no matter the user query should always be in following json format. format: {"includedTypes": [list of types here]}`,
  });

  const query = placeTypes.parse(
    JSON.parse(
      generatedPlacesQuery.text.replace(/^```json\n([\s\S]*)\n```$/m, "$1"),
    ),
  );

  const { places } = await fetchNearbyPlaces(query.includedTypes, location);

  const placePrompt = `Given the following descprtion of 20 locations, provide suggestion for only one location or multiple based on the user query which is ${current_query}. For example if the user is saying I want sushi then you should only provide one suggesstion, but if they say i want sushi and icecream then only two suggestions for each category. Provide the minimal amount of suggestions that satisfy the user's query. Your response should be a json with following schema: {"places":[{"id":"appropriate place id","name":"name of the place"}]} \n ${JSON.stringify(places)}`;
  const placeSuggestions = await generateText({
    model: google("models/gemini-1.5-pro-latest"),
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
    const photoUrl =
      details.photos && (await fetchPlacePhotos(details.photos[0]?.name ?? ""));
    processedSuggestions.push({
      name: details.displayName.text,
      url: details.googleMapsUri,
      photo: photoUrl ?? "", //put placeholder image here
    });
  }
  res.status(200).json({ suggestions: processedSuggestions });
}

export const config = {
  maxDuration: 60,
};
