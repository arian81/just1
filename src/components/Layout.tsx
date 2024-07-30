import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  return (
    <div className=" min-h-screen ">
      <header className="background-red absolute top-0 z-10 flex w-full  items-center justify-between p-2">
        <span className="text-2xl text-white">just1</span>
        <a href="https://x.com/TheArian81" className="hidden sm:block">
          <Badge
            variant="outline"
            className="text-yellow-600 dark:text-yellow-300"
          >
            work in progress, click for updates!
          </Badge>
        </a>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {status === "authenticated" && (
            <Button
              onClick={() => signOut()}
              className="btn rounded-lg bg-yellow-300 text-black hover:bg-yellow-200"
            >
              Sign out
            </Button>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
