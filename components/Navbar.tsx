
export default function Navbar() {
  return (
    <nav className="w-3/4 mx-auto flex items-center justify-between px-6 py-4 bg-transparent  ">
      <div className="flex flex-row gap-2 items-center">

        <img src="/icon.svg" alt="icon" className="w-7 h-7" />

        <h1
          className={`text-3xl font-semibold text-white tracking-wide`}
        >
          Whispr
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-zinc-400 text-sm">No signups. No limits.</span>
      </div>
    </nav>
  );
}