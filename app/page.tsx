import Topbar from "@/components/topbar";
import Image from "next/image";
import GetStartedGuide from "@/components/get-started";
import dashboard from "./assets/Dashboard.svg";

export default function Home() {
  return (
    <div className="flex justify-center flex-col">
      <Topbar />
      <div className="mt-8 flex justify-center items-center flex-col">
        <p className="text-3xl font-medium sm:text-3xl md:text-5xl lg:text-6xl">
          Connect. Share. Learn.
        </p>
      </div>
      <div className="flex items-center justify-center text-center max-w-lg mx-auto p-6 bg-gray-50">
        <p className="text-gray-700 text-base leading-relaxed font-light">
          Knowledge is the most valuable asset in the world. At Notedrop, we
          believe that sharing knowledge is key to helping students succeed and
          grow. That&apos;s why we created a platform where students can
          connect, learn, and contribute by sharing their notes.
        </p>
      </div>
      <div>
        <div className="mx-auto max-w-6xl px-6 lg:px-8 mb-9">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src={dashboard}
                alt="product preview"
                width={1920}
                height={1080}
                quality={100}
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
      <GetStartedGuide />
      <footer>
        <p className="text-center">Made by SkuliX</p>
      </footer>
    </div>
  );
}
