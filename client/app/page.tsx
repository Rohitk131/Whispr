import DarkVeil from "@/components/DarkVeil";
import Navbar from "@/components/Navbar";
import { IconMicrophone } from '@tabler/icons-react';
import BlurText from "@/components/BlurText";
import DecryptedText from "@/components/DecryptedText";
export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden text-white">

      <DarkVeil />


      <div className="absolute inset-0 z-10 flex flex-col">

        <Navbar />


        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">

          <BlurText
            text=" Turn your voice into text, instantly."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-6xl font-medium mb-2"
          />


          <DecryptedText
            text="Start Speaking. Stop Typing."
            animateOn="view"
            revealDirection="start"
            speed={80}
            maxIterations={30}
            className=""

          />


          <div className="w-full max-w-2xl h-1/2 bg-black/40 border border-gray-800 rounded-lg flex mb-6 mt-6 p-4">
            <p className="text-gray-400">Your text will appear here...</p>
          </div>


          <div className="flex flex-row gap-4">
          <button className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-neutral-700 bg-gradient-to-tr from-neutral-900 to-neutral-800 px-4 py-2 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-neutral-600 active:shadow-none">
  <IconMicrophone stroke={2} />
  <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-300 ease-out group-hover:h-32 group-hover:w-32"></span>
  <span className="relative font-medium text-lg">Start Recording</span>
</button>


          </div>
        </div>
      </div>
    </div>
  );
}
