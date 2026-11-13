import React from "react";
import { Outlet } from "react-router";

export default function EmbedLayout() {
  return (
    <div className="w-full min-h-screen bg-transparent p-2 sm:p-4 m-0 overflow-x-hidden antialiased flex items-center justify-center">
      <main className="w-full max-w-lg">
        <Outlet />
      </main>
    </div>
  );
}
