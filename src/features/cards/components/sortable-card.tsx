"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardData } from "../types/card.types";

interface SortableCardProps {
  card: CardData;
  priority: number;
}

export function SortableCard({ card, priority }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        className="bg-card border-border cursor-grab active:cursor-grabbing w-full"
        {...attributes}
        {...listeners}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-foreground text-sm font-medium flex-1 min-w-0">
              {card.title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              Priority: {priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed break-words">
            {card.content}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
