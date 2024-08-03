import Head from "next/head";

import React, { use, useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, buttonVariants } from "~/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router
        .push("/go")
        .catch((error) => console.error("Failed to redirect:", error));
    }
  }, [status, router]);

  return (
    <>
      <Head>
        <title>Just 1 place</title>
        <meta
          name="description"
          content="Let AI be your personal planner, picking just one cool spot from tons of reviews so you don't have to stress about where to go"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:url" content="https://just1.place" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Just 1 place" />
        <meta
          property="og:description"
          content="Let AI be your personal planner, picking just one cool spot from tons of reviews so you don't have to stress about where to go"
        />
        <meta property="og:image" content="https://just1.place/meta.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="just1.place" />
        <meta property="twitter:url" content="https://just1.place" />
        <meta name="twitter:title" content="Just 1 place" />
        <meta
          name="twitter:description"
          content="Let AI be your personal planner, picking just one cool spot from tons of reviews so you don't have to stress about where to go"
        />
        <meta name="twitter:image" content="https://just1.place/meta.png" />
      </Head>
      <div className=" h-full pt-24 text-yellow-300">
        {/* Background */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        />

        {/* Content */}
        <div className="h-full flex-col justify-between p-6">
          <main className="flex flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              impromptu hangout planner
            </h1>
            <p className="mx-auto max-w-2xl text-xl">
              let ai be your personal planner, picking just one cool spot from
              tons of reviews so you don&apos;t have to stress about where to go
            </p>
            <div className="flex gap-5 p-10">
              <Button className="" onClick={() => signIn("google")}>
                Sign in for access
              </Button>
              {/* <Button variant={"outline"}>buildspace demo</Button> */}
              <Link
                href={"/demo"}
                className={
                  buttonVariants({ variant: "ghost" }) +
                  " border border-solid border-yellow-400 hover:border-none"
                }
              >
                buildspace demo
              </Link>
            </div>
          </main>

          {/* Footer */}
          <footer className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
            <div className="">
              <svg
                width="60"
                height="50"
                viewBox="0 0 60 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.6757 4.07209L26.0259 1.63861C27.7112 -0.30816 30.9541 -0.714907 33.0198 1.48669L57.9125 28.0167C59.9639 30.203 59.4289 33.7159 56.8181 35.2026L31.9254 49.378C30.2101 50.3548 28.262 50.1171 26.8574 49.1111L2.34853 35.1543C-0.262213 33.6676 -0.797212 30.1547 1.25415 27.9684C2.19876 26.9617 3.71857 26.7358 4.91886 27.4236L26.8574 39.9535V30.5415L12.5428 22.4183C10.5215 21.2577 10.1103 18.5337 11.6997 16.8359L11.7026 16.8327L11.705 16.8302C12.8599 15.6016 14.7163 15.3264 16.1826 16.1667L26.8574 22.1699V13.0847L23.4614 10.9636C21.3811 9.77136 19.5032 8.51903 21.1404 6.77417L23.6757 4.07209Z"
                  fill="#FFE600"
                />
              </svg>
            </div>
            <div className="text-lg">
              nights & weekends <span className="font-bold">s5</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
