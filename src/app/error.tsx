"use client";
import Image from "next/image";
import Link from "next/link";

export default function Error() {
  const catImageUrl = `https://http.cat/500.jpg`;

  return (
    <div className="flex justify-center items-start h-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Oops!</h1>

        <div className="w-full h-[350px] md:w-[350px] relative mx-auto mt-4">
          <Image
            fill
            objectFit="contain"
            src={catImageUrl}
            alt={`Cat stuck in a machine`}
            className="mx-auto"
          />
        </div>
        <p className="text-lg mt-4">
          Well, this is awkward. Something went wrong. Try again later, maybe?
        </p>
        <div className="mt-8">
          <Link href="/" className="text-blue-500 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
