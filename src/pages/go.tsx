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
import { useEffect, useState, useRef } from "react";
import type { Location } from "~/lib/types";
import Modal from "~/components/Modal";
import { getServerAuthSession } from "~/server/auth";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { motion } from "framer-motion";

type ChatProps = {
  session?: Session | null;
};

const Chat: NextPage<ChatProps> = () => {
  const { data: session } = useSession();
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: { location: location },
    streamProtocol: "text",
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      const queryCount = parseInt(sessionStorage.getItem("queryCount") ?? "0");
      if (queryCount >= 3) {
        setShowLoginPrompt(true);
        return;
      }
      sessionStorage.setItem("queryCount", (queryCount + 1).toString());
    }

    if (location) {
      handleSubmit(e);
      setShowLoginPrompt(false);
    } else if (error) {
      alert(`Error: ${error}`);
    } else {
      alert("Please wait for location to load");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "-1px -1px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.7) 70%, rgba(0, 0, 0, 0.9) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col py-8">
        <Modal loading={locationLoading} error={error} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-4xl font-extrabold text-transparent backdrop-blur-[0.5px]">
            Just1
          </h1>
          <p className="text-gray-300 backdrop-blur-[0.5px]">
            Discover amazing places near you
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 overflow-y-auto">
          {messages.map((m, index) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {m.role === "user" ? (
                <motion.p
                  className="mb-4 rounded-lg bg-gradient-to-r from-yellow-300 to-yellow-400 p-4 text-sm text-black shadow-lg backdrop-blur-[0.5px] md:text-base"
                  whileHover={{ scale: 1.01 }}
                >
                  Here are my suggestions for: {m.content}
                </motion.p>
              ) : m.role === "assistant" ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {suggestionSchema
                      .parse(JSON.parse(m.content))
                      .suggestions.map((suggestion, idx) => (
                        <CarouselItem key={idx}>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card className="h-full overflow-hidden rounded-xl border-0 bg-transparent ">
                              <CardHeader className="flex items-center">
                                <CardTitle className="text-lg font-bold tracking-tight text-white backdrop-blur-[0.5px] md:text-xl">
                                  {suggestion.name.toLowerCase()}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="relative h-44 w-full overflow-hidden rounded-lg md:h-56">
                                  <Image
                                    src={suggestion.photo}
                                    alt={suggestion.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="transition-transform duration-700 hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end">
                                <Link
                                  href={suggestion.url}
                                  className="rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 px-4 py-2 text-xs font-medium text-black backdrop-blur-[0.5px] transition-all hover:shadow-lg hover:shadow-yellow-300/30 md:text-sm"
                                  target="_blank"
                                >
                                  View location
                                </Link>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50" />
                  <CarouselNext className="right-1 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50" />
                </Carousel>
              ) : null}
            </motion.div>
          ))}

          {/* Loading state for new message */}
          {(status === "submitted" || status === "streaming") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="w-full overflow-hidden rounded-xl border-0 bg-gradient-to-b from-gray-800 to-black shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold">
                    <Skeleton className="mx-auto h-8 w-56 bg-gray-700" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Skeleton className="h-48 w-full bg-gray-700" />
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Skeleton className="h-10 w-32 bg-gray-700" />
                </CardFooter>
              </Card>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-md border border-red-500 bg-red-900/30 p-4 text-center text-red-300 backdrop-blur-sm"
          >
            You have reached the query limit. Please{" "}
            <Link
              href="/api/auth/signin"
              className="font-bold text-yellow-300 underline backdrop-blur-[0.5px]"
            >
              log in
            </Link>{" "}
            to continue.
          </motion.div>
        )}
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 backdrop-blur-[0.5px]"
          >
            No location found. Please ensure you have enabled location services.
            Try refreshing the page.
          </motion.p>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleFormSubmit}
            className="mt-6 flex gap-3"
          >
            <div className="relative flex-grow">
              <Input
                className="h-12 w-full rounded-full border border-yellow-400 bg-transparent p-4 pl-5 pr-12 text-sm text-white backdrop-blur-[0.5px] focus:!outline-none focus:!ring-0 md:text-base"
                value={input}
                placeholder="What do you want to do?"
                onChange={handleInputChange}
                disabled={showLoginPrompt}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="h-12 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 px-6 text-sm font-medium text-black shadow-lg backdrop-blur-[0.5px] transition-all hover:shadow-yellow-300/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
              disabled={showLoginPrompt}
            >
              go
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  return { props: {} };
};

export default Chat;
