import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DarkModeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDarkMode = () => {
    if (resolvedTheme === "dark") {
      if (localStorage.getItem("alreadyConfirmed") === "true") {
        setTheme("light");
      } else {
        setIsModalOpen(true);
      }
    } else {
      setTheme("dark");
    }
  };

  const confirmToggle = () => {
    setTheme("light");
    localStorage.setItem("alreadyConfirmed", "true");
    setIsModalOpen(false);
  };

  // Render nothing on the server
  if (!mounted) return null;

  return (
    <>
      <Button variant="ghost" onClick={toggleDarkMode} className="p-2 px-4">
        {resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>

      {isModalOpen && (
        <div className="absolute">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
              </DialogHeader>
              <div>
                There is a reason why dark mode is enabled by default, are you
                sure you want to blind yourself?
              </div>
              <div className="flex flex-wrap gap-2 justify-end space-x-4">
                <Button onClick={() => setIsModalOpen(false)} variant="outline">
                  NO, get me the hell out of here
                </Button>

                <Button onClick={confirmToggle} variant="destructive">
                  YES, please blind me
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};
