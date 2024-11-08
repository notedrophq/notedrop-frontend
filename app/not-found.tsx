"use client";

import Image from "next/image";
import dashboard from "./assets/logo.png";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Image quality={100} src={dashboard} alt="logo" />
      <h1 className="font-medium text-5xl">404 - Page Not Found.</h1>
      <p className="mt-3 text-3xl font-light">
        Oops page that you are looking for does not exist :(
      </p>
      <button
        className="mt-4 w-[175px] h-[45px] bg-black text-white text-xl font-light rounded-xl hover:bg-[#15D364] transition-colors duration-500"
        onClick={() => router.push("/")}
      >
        Go Back Home
      </button>
    </div>
  );
}
