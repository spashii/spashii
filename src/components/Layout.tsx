import { Header } from "./Header";
import { Footer } from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen container mx-auto max-w-5xl">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
