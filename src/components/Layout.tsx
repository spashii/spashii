import { Header } from "./Header";
import { Footer } from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-dvh container mx-auto max-w-5xl !px-4 !md:px-8">
      <Header />
      <main className="py-6">{children}</main>
      <Footer />
    </div>
  );
}
