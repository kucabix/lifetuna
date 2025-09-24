"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { SortableCard } from "./sortable-card";
import { CardData } from "../types/card.types";
import { Button } from "@/components/ui/button";

interface SortableCardsListProps {
  initialCards?: CardData[];
  onContinue?: () => void;
  onSavePriorities?: (priorities: CardData[]) => Promise<void>;
}

export function SortableCardsList({
  initialCards = [],
  onContinue,
  onSavePriorities,
}: SortableCardsListProps) {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [isSaving, setIsSaving] = useState(false);
  // Track if component has mounted on client to prevent hydration mismatch with @dnd-kit
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <div className="grid gap-2 p-2 max-h-[60vh] overflow-y-auto max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-card border-border rounded-lg p-4 w-full"
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-foreground text-sm font-medium flex-1 min-w-0">
                  {card.title}
                </h3>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded flex-shrink-0">
                  Priority: {index + 1}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed break-words">
                {card.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%,
          85%,
          100% {
            transform: translateX(0);
          }
          88% {
            transform: translateX(-2px);
          }
          91% {
            transform: translateX(2px);
          }
          94% {
            transform: translateX(-2px);
          }
          97% {
            transform: translateX(2px);
          }
        }
      `}</style>
      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={cards} strategy={verticalListSortingStrategy}>
            <div className="grid gap-2 p-2 max-h-[60vh] overflow-y-auto max-w-4xl mx-auto">
              {cards.map((card, index) => (
                <SortableCard key={card.id} card={card} priority={index + 1} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {onContinue && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={async () => {
                if (onSavePriorities) {
                  setIsSaving(true);
                  try {
                    await onSavePriorities(cards);
                  } catch (error) {
                    console.error("Failed to save priorities:", error);
                    // Still continue even if saving fails
                  } finally {
                    setIsSaving(false);
                  }
                }
                onContinue();
              }}
              disabled={isSaving}
              className="px-8 py-2 bg-primary text-primary-foreground font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse hover:animate-none"
              style={{
                animation: isSaving ? "none" : "shake 3s ease-in-out infinite",
              }}
            >
              {isSaving ? "Saving..." : "Continue"}
              <svg
                className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2 12h18m-9-7l9 7-9 7"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
