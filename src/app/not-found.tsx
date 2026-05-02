import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="text-gray-500">Could not find requested resource</p>
      <Button asChild className="mt-4" variant="outline">
        <Link href={"/"}>Return home</Link>
      </Button>
    </div>
  );
}
