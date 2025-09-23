"use client";

import Tuna from "@/assets/tuna.svg";
import { SortableCardsList, cards } from "@/features/cards";
import { Button } from "@/components/ui/button";

export default function Home() {
  const handleContinue = () => {
    window.location.href = "/login";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <main>
      <header className="relative py-8">
        <div className="flex flex-col items-center gap-2">
          <Tuna width={80} height={80} className="text-foreground" />
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            Life Tuna
          </h1>
        </div>
        <div className="absolute top-8 right-8">
          <Button onClick={handleLogin} variant="outline">
            Login
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4">
        <SortableCardsList initialCards={cards} onContinue={handleContinue} />
      </section>
    </main>
  );
}
