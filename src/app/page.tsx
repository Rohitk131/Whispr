'use client'
import { useState } from "react";
import Button from "@/components/Button";
import { billionary } from "@/fonts/fonts";

export default function Home() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleStart = () => {
    setIsListening(!isListening);
    if (!isListening) {
      console.log("Started listening...");
    } else {
      console.log("Stopped listening...");
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className={`text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-gray-600 ${billionary.className} `}>
        Turn your voice into text, instantly.
      </h1>

      <div
        className="w-full max-w-3xl min-h-[350px] p-6 rounded-2xl bg-gradient-to-b from-zinc-900/70 to-zinc-800/50 backdrop-blur-md border border-zinc-700 text-lg leading-relaxed text-white overflow-y-auto shadow-lg"
      >
        {text ? (
          text
        ) : (
          <span className="text-zinc-500">
            Start speaking to see your words appear...
          </span>
        )}
      </div>

      <div className="flex flex-row gap-4">
        <Button onClick={handleStart}>
          {isListening ? "Stop" : "Start"}
        </Button>
        <Button onClick={handleClear}>Clear</Button>
      </div>
    </div>
  );
}