"use client";

import Tuna from "@/assets/tuna.svg";
import { SortableCardsList } from "@/features/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ProfileIcon } from "@/components/profile-icon";
import { apiClient } from "@/lib/api-client";
import { CardData } from "@/features/cards/types/card.types";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [cards, setCards] = useState<CardData[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  const handleContinue = () => {
    if (user) {
      // User is logged in, go to questions page
      window.location.href = "/questions";
    } else {
      // User is not logged in, go to login page
      window.location.href = "/login";
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  // Fetch data only after auth state is determined
  useEffect(() => {
    if (isLoading) return; // Still loading auth state

    const fetchData = async () => {
      try {
        setCardsLoading(true);
        let response;

        if (user?.id) {
          // User is logged in, fetch their priorities
          response = await apiClient.getUserPriorities(user.id);
          if (response.success && response.data) {
            const cardData: CardData[] = response.data.map((priority) => ({
              id: priority.categoryId,
              title: priority.categoryTitle,
              content: priority.categoryDescription,
              rank: priority.rank,
            }));
            setCards(cardData);
          }
        } else {
          // User is not logged in, fetch all available categories
          response = await apiClient.getPriorityCategories();
          if (response.success && response.data) {
            const cardData: CardData[] = response.data.map((category) => ({
              id: category.id,
              title: category.title,
              content: category.description,
            }));
            setCards(cardData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setCardsLoading(false);
      }
    };

    fetchData();
  }, [isLoading, user?.id]);

  const handleSavePriorities = async (priorities: CardData[]) => {
    if (!user) {
      throw new Error("User must be logged in to save priorities");
    }

    try {
      // Bulk update all priorities in a single request
      await apiClient.bulkUpdatePriorities(user.id, {
        priorities: priorities.map((priority, index) => ({
          categoryId: priority.id,
          rank: index + 1,
        })),
      });
    } catch (error) {
      console.error("Failed to save priorities:", error);
      throw error;
    }
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
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <ProfileIcon />
          ) : (
            <Button onClick={handleLogin} variant="outline">
              Login
            </Button>
          )}
        </div>
      </header>

      <section className="container mx-auto px-4">
        {cardsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">
              Loading priority categories...
            </div>
          </div>
        ) : (
          <SortableCardsList
            initialCards={cards}
            onContinue={handleContinue}
            onSavePriorities={user ? handleSavePriorities : undefined}
          />
        )}
      </section>
    </main>
  );
}
