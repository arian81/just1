import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Extract first name from full name
  const firstName = session?.user?.name
    ? session.user.name.split(" ")[0]
    : null;

  return (
    <div className=" min-h-screen ">
      <header className="background-red absolute top-0 z-10 flex w-full  items-center justify-between p-2">
        <span className="text-2xl text-black dark:text-white">just1</span>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <p className="text-sm font-medium text-white">
                Hey, {firstName ?? "friend"}! ✨
              </p>
              <Button
                onClick={() => signOut()}
                className="btn rounded-lg bg-yellow-300 text-black hover:bg-yellow-200"
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => signIn()}
              className="btn rounded-lg bg-yellow-300 text-black hover:bg-yellow-200"
            >
              Sign in
            </Button>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
