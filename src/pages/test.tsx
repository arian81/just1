import { type NextPage } from "next";
import { useChat } from "ai/react";
import { z } from "zod";
import { use, useEffect, useState } from "react";
import Image from "next/image";
// import suggestionSchema from "~/pages/api/chat";

interface Location {
  latitude: number;
  longitude: number;
}

const Test: NextPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      streamMode: "text",
    });
  const suggestionSchema = z.object({
    suggestions: z.array(
      z.object({
        url: z.string(),
        name: z.string(),
        // photos: z.array(z.any()),
        photos: z.string(),
      }),
    ),
  });
  // const [location, setLocation] = useState<Location | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position: GeolocationPosition) => {
  //         console.log("position", position);
  //         setLocation({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //         });
  //         setLoading(false);
  //       },
  //       (error: GeolocationPositionError) => {
  //         setError(error.message);
  //         setLoading(false);
  //       },
  //     );
  //   } else {
  //     setError("Geolocation is not supported by your browser");
  //     setLoading(false);
  //   }
  // }, []);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center dark:bg-black">
      <h1 className="text-4xl text-yellow-300">Just1 Place: Hangout planner</h1>
      <div className=" mx-auto flex w-full max-w-md flex-col py-24">
        {/* {isLoading ? (
          <div>loading...</div>
        ) : (
          <>
            <h2 className="mb-4text-2xl font-bold dark:text-white">
              Here are my suggestions
            </h2>
            <div className="flex flex-col gap-10">
              {messages
                .filter((m) => m.role === "assistant")
                .map((m) => (
                  <div key={m.id} className="flex gap-5 whitespace-pre-wrap">
                    {suggestionSchema
                      .parse(JSON.parse(m.content))
                      .suggestions.map((suggestion, idx) => (
                        <a
                          key={idx}
                          href={suggestion.url}
                          className="bg-white p-5"
                          target="_blank"
                        >
                          <h3 className="text-lg">{suggestion.name}</h3>
                          <Image
                            src={suggestion.photos}
                            width={500}
                            height={500}
                            alt={suggestion.name}
                          ></Image>
                        </a>
                      ))}
                  </div>
                ))}
            </div>
          </>
        )} */}
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <>
            <div className="flex flex-col gap-10">
              {messages.map((m) => (
                <div key={m.id}>
                  {m.role === "user" ? (
                    <p className="mb-4">
                      Here are my suggestions for: {m.content}
                    </p>
                  ) : m.role === "assistant" ? (
                    <div className="flex gap-5 whitespace-pre-wrap">
                      {suggestionSchema
                        .parse(JSON.parse(m.content))
                        .suggestions.map((suggestion, idx) => (
                          <a
                            key={idx}
                            href={suggestion.url}
                            className="bg-white p-5"
                            target="_blank"
                          >
                            <h3 className="text-lg">{suggestion.name}</h3>
                            <Image
                              src={suggestion.photos}
                              width={500}
                              height={500}
                              alt={suggestion.name}
                            />
                          </a>
                        ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <input
            className=" mb-8 mt-10 w-full max-w-lg rounded border border-gray-300 p-2 shadow-xl dark:bg-white"
            value={input}
            placeholder="Say something like 'I want to grab some mexican foood'"
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default Test;
