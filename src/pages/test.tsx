// start a test nextpage component
import exp from "constants";
import { type NextPage } from "next";
import { ModeToggle } from "~/components/ModeToggle";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

const Test: NextPage = () => {
  return (
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
        <Button className="bg-yellow-500 text-black">view location</Button>
      </CardFooter>
    </Card>
  );
};

export default Test;
