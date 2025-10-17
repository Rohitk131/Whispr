import { billionary } from "@/fonts/fonts";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-transparent">
      <h1
        className={`${billionary.className} text-3xl font-semibold text-white tracking-wide`}
      >
        Whispr
      </h1>

       <div className="flex items-center gap-4">
        <span className="text-zinc-400 text-sm">No signups. No limits.</span>
      </div>
    </nav>
  );
}
