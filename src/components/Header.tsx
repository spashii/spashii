"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FunctionComponent, Suspense, useEffect, useState } from "react";
import { AquariumScene } from "./three/AquariumScene";
interface MenuItem {
  name: string;
  href: string;
  openInNewTab?: boolean;
}
const menuItems: MenuItem[] = [
  { name: "Journal", href: "/" },
  { name: "Tags", href: "/tag" },
  { name: "About", href: "/about" },
];
export const Navigation: FunctionComponent = () => {
  const pathname = usePathname();

  return (
    <nav>
      <div className="hidden md:flex items-center">
        {menuItems.map((item) => (
          <div key={item.href} className="ml-4 md:ml-8">
            <a
              href={item.href}
              target={item.openInNewTab ? "_blank" : "_self"}
              className={cn(
                "hover:text-gray-900 hover:dark:text-gray-200",
                pathname === item.href && "font-semibold"
              )}
            >
              {item.name}
            </a>
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu size="24" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="text-left text-2xl">
                  <Link href="/" className="font-semibold">
                    {config.blog.name}
                  </Link>
                  <div className="text-left space-y-2 mt-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target={item.openInNewTab ? "_blank" : "_self"}
                        className={cn(
                          "block text-sm",
                          pathname === item.href && "font-semibold"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        `fixed top-0 left-0 right-0 z-50 transition-all duration-400`,
        isScrolled
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-md py-0 border-b dark:border-gray-800"
          : "bg-transparent py-4 md:py-8"
      )}
    >
      <div className="mx-auto px-4 md:px-8">
        <section className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <Suspense
              fallback={
                <div
                  className={`h-[${isScrolled ? "50px" : "100px"}] w-[${
                    isScrolled ? "50px" : "100px"
                  }]`}
                />
              }
            >
              <div
                className={cn(
                  "transition-all duration-300 !cursor-crosshair w-[100px] h-[100px]"
                )}
              >
                <AquariumScene />
              </div>
            </Suspense>
            <Link href="/">
              <h1
                className={`font-bold tracking-tighter leading-tight transition-all duration-300 ${
                  isScrolled ? "text-xl" : "text-2xl"
                }`}
              >
                {config.blog.name}
              </h1>
            </Link>
          </div>
          <Navigation />
        </section>
      </div>
    </header>
  );
};
