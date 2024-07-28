import { Header } from "./Header";
import { Footer } from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-grow container h-full mx-auto max-w-5xl px-4 md:px-8 pt-32 md:pt-[256px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
