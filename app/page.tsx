import DarkVeil from "@/components/DarkVeil";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
     
      <DarkVeil />

      
      <div className="absolute inset-0 z-10 flex flex-col">
        
        <Navbar />

        
        <div className="flex flex-1 flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Turn your voice into text, instantly.
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            You can add buttons, hero text, or components here later.
          </p>
        </div>
      </div>
    </div>
  );
}
