import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <span className="text-2xl">just1</span>
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
      <main className="flex-grow">{children}</main>
    </div>
  );
}
