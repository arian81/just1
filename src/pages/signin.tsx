import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

const SignInPage: NextPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="mx-auto flex w-full max-w-md flex-col py-8">
        {" "}
        {/* Adjusted max-w for a typical sign-in form */}
        <Card className="w-full bg-white text-black dark:bg-black dark:text-white">
          {" "}
          {/* Assuming default light/dark theme */}
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold md:text-2xl">
              Sign In
            </CardTitle>
            <CardDescription>
              Sign in to continue using the app without limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <button
              onClick={() => void signIn("google", { callbackUrl: "/go" })} // Specify 'google' provider
              className="w-full rounded bg-yellow-300 p-2 px-5 text-sm font-medium text-black transition-colors hover:bg-yellow-400 md:text-base"
            >
              Sign In / Sign Up with Google
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Or go back to{" "}
              <Link href="/go" className="underline hover:text-yellow-500">
                the app
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
