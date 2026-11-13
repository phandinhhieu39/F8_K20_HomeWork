import { Outlet } from "react-router";
import Logo from "./Logo";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-5 px-2 justify-between z-50 bg-[#fafafa] border-r border-neutral-200/60">
        <Logo />
        <Navigation />
        <UserMenu />
      </aside>

      {/* Header Mobile */}
      <header className="md:hidden sticky top-0 z-40 h-14 bg-[#fafafa]/90 backdrop-blur-md border-b border-neutral-200/60 px-4 flex items-center justify-between">
        <div className="w-8" />
        <Logo />
        <div className="w-10 flex justify-end">
          <UserMenu />
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="md:pl-20 pb-20 md:pb-0 w-full min-h-screen">
        <Outlet />
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-2 py-1">
        <Navigation />
      </nav>
    </div>
  );
}
