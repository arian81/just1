import Head from "next/head";

import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

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
      <div className="relative h-screen overflow-hidden text-yellow-300">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <span className="text-2xl">just1</span>
            <a href="https://x.com/TheArian81">
              <div className="badge badge-outline">
                coming soon, click for updates!
              </div>
            </a>
            {status === "authenticated" ? (
              <button
                onClick={() => signOut()}
                className=" btn rounded-lg bg-yellow-300 text-black hover:bg-yellow-200"
              >
                Sign out
              </button>
            ) : (
              <span className="invisible text-2xl">just1</span>
            )}
          </header>

          {/* Main Content */}
          <main className="text-center">
            <h1 className="mb-4 text-6xl font-bold">
              impromptu hangout planner
            </h1>
            <p className="mx-auto max-w-2xl text-xl">
              let ai be your personal planner, picking just one cool spot from
              tons of reviews so you don&apos;t have to stress about where to go
            </p>
            {status === "authenticated" ? (
              <div className="flex items-center justify-center p-10">
                <div className="rounded-md bg-yellow-300 p-4 text-black">
                  <p className="w-fit text-lg font-bold ">
                    thanks for signing up{" "}
                    {session.user.name?.split(" ")[0]?.toLowerCase()}! i&apos;ll
                    send you an email when i&apos;m done cooking.
                  </p>
                  <a href="https://youtu.be/BkjqUHlj6zA" className="underline">
                    check out this quick demo in the meantime
                  </a>
                </div>
              </div>
            ) : (
              <button
                className="mt-8 rounded-lg bg-yellow-300 px-6 py-3 text-xl font-bold text-black"
                onClick={() => signIn("google")}
              >
                Sign up for access
              </button>
            )}
          </main>

          {/* Footer */}
          <footer className="flex items-end justify-between">
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
