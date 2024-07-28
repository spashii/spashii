"use client";
import { config } from "@/config";
import { Rss } from "lucide-react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Button } from "./ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";

export const Footer: FunctionComponent = () => {
  return (
    <section>
      <div className="flex items-center flex-wrap justify-between gap-2 pb-4 mx-4">
        <div className="text-sm text-muted-foreground">
          © {config.blog.copyright} {new Date().getFullYear()}
        </div>
        <div className="space-x-2">
          <Link href="https://github.com/spashii">
            <Button variant="ghost">
              <SiGithub className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/rss">
            <Button variant="ghost">
              <Rss className="w-4 h-4" />
            </Button>
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </section>
  );
};
