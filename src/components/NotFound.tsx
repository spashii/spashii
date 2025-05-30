"use client";

import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import Link from "next/link";

export const NotFound = () => {
  return (
    <div>
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-2xl">
        Congrats, you&apos;ve found a secret page of nothing!
      </p>

      <Button asChild className="mt-4">
        <Link href="/">
          <Undo className="mr-2 h-4 w-4" /> Let&apos;s get you back to
          civilization
        </Link>
      </Button>
    </div>
  );
};
