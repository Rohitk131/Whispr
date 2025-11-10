
export default function Navbar() {
  return (
    <nav className="w-full md:w-3/4 mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-transparent">
      <div className="flex flex-row gap-2 items-center">
        <img src="/icon.svg" alt="icon" className="w-6 h-6 md:w-7 md:h-7" />
        <h1
          className={`text-2xl md:text-3xl font-semibold text-white tracking-wide`}
        >
          Whispr
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-zinc-400 text-xs md:text-sm">No signups. No limits.</span>
      </div>
    </nav>
  );
}