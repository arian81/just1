import { type GetServerSidePropsContext, type NextPage } from "next";
import { useChat } from "@ai-sdk/react";
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
import { useEffect, useState } from "react";
import type { Location } from "~/lib/types";
import Modal from "~/components/Modal";
import { getServerAuthSession } from "~/server/auth";

const Chat: NextPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: { location: location },
    streamProtocol: "text",
  });
  console.log("DEBUGGGGGGGG", messages);
  const suggestionSchema = z.object({
    suggestions: z.array(
      z.object({
        url: z.string().url(),
        name: z.string(),
        photo: z.string(),
      }),
    ),
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error: GeolocationPositionError) => {
          setError(error.message);
          setLocationLoading(false);
        },
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      handleSubmit(e);
    } else if (error) {
      alert(`Error: ${error}`);
    } else {
      alert("Please wait for location to load");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full max-w-xl flex-col py-8">
        <Modal loading={locationLoading} error={error} />
        {status === "submitted" || status === "streaming" ? (
          <Card className="w-full bg-black text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">
                <Skeleton className="mx-auto h-8 w-56" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Skeleton className="h-48 w-full" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              {messages.map((m) => (
                <div key={m.id}>
                  {m.role === "user" ? (
                    <p className="mb-4 rounded-md bg-yellow-300 p-4 text-sm text-black md:text-base">
                      Here are my suggestions for: {m.content}
                    </p>
                  ) : m.role === "assistant" ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {suggestionSchema
                          .parse(JSON.parse(m.content))
                          .suggestions.map((suggestion, idx) => (
                            <CarouselItem key={idx}>
                              <Card className="h-full">
                                <CardHeader className="flex items-center">
                                  <CardTitle className="text-lg md:text-xl">
                                    {suggestion.name.toLowerCase()}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="relative h-36 w-full md:h-48">
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
                                    className="rounded-md bg-yellow-300 p-2 text-xs text-black md:text-sm"
                                    target="_blank"
                                  >
                                    View location
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
        {error ? (
          <p className="text-red-500">
            No location found. Please ensure you have enabled location services.
            Try refreshing the page.
          </p>
        ) : (
          <form onSubmit={handleFormSubmit} className="mt-6 flex gap-5">
            <Input
              className="flex-grow rounded-l bg-black p-2 text-sm text-white dark:bg-white dark:text-black md:text-base"
              value={input}
              placeholder="What do you want to do?"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="rounded bg-yellow-300 p-2 px-5 text-sm text-black md:text-base"
            >
              go
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerAuthSession(context);

  if (!session || !session.user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
};

export default Chat;
