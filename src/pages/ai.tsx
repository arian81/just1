import { type NextPage } from "next";
import { useChat } from "ai/react";
import { z } from "zod";
import Image from "next/image";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Skeleton } from "~/components/ui/skeleton";

import Link from "next/link";
import { use, useEffect, useState } from "react";

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
        url: z.string().url(),
        name: z.string(),
        photo: z.string(),
      }),
    ),
  });
  const [historyCopy, setHistoryCopy] = useState<string[]>([]);
  useEffect(() => {
    setHistoryCopy(messages.map((m) => m.content));
  }, [messages]);
  console.log("messages", historyCopy);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-4xl text-yellow-300">just1 place: hangout planner</h1>
      <div className=" mx-auto flex w-full max-w-md flex-col py-24">
        {isLoading ? (
          <Card className="w-full max-w-md bg-black text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">
                <Skeleton className="h-8 w-56" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link
                href={""}
                className=" rounded-md bg-yellow-300 p-2 text-sm text-black"
                target="_blank"
              >
                view location
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-10">
              {messages.map((m) => (
                <div key={m.id}>
                  {m.role === "user" ? (
                    <p className="mb-4 rounded-md bg-yellow-300 p-5 text-black">
                      here are my suggestions for: {m.content}
                    </p>
                  ) : m.role === "assistant" ? (
                    <Carousel>
                      <CarouselContent>
                        {suggestionSchema
                          .parse(JSON.parse(m.content))
                          .suggestions.map((suggestion, idx) => (
                            <CarouselItem key={idx} className="">
                              <Card key={idx}>
                                <CardHeader className="flex items-center">
                                  <CardTitle>
                                    {suggestion.name.toLowerCase()}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="relative  h-48 w-full">
                                    <Image
                                      src={suggestion.photo}
                                      alt={suggestion.name}
                                      layout="fill"
                                      objectFit="cover"
                                      className="rounded-md"
                                    />
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                  <Link
                                    href={suggestion.url}
                                    className=" rounded-md bg-yellow-300 p-2 text-sm text-black"
                                    target="_blank"
                                  >
                                    view location
                                  </Link>
                                </CardFooter>
                              </Card>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            className="mb-8 mt-10 w-full max-w-lg rounded p-2"
            value={input}
            placeholder="Say something like 'I want to grab some mexican food'"
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default Test;
