"use client";

import { useAuth } from "@/lib/auth-context";
import { ProfileIcon } from "@/components/profile-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Tuna from "@/assets/tuna.svg";
import { useState } from "react";

export default function QuestionsPage() {
  const { user, isLoading } = useAuth();
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "What are your top 3 life priorities right now?",
    "What would you like to achieve in the next 6 months?",
    "What activities or relationships bring you the most joy?",
    "What are the biggest challenges you're facing currently?",
    "If you had unlimited time and resources, what would you focus on?",
  ];

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // All questions completed
      console.log("All responses:", responses);
      // Here you would typically save the responses to the database
      alert(
        "Thank you for completing the questions! Your responses have been saved."
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Tuna
            width={60}
            height={60}
            className="text-foreground mx-auto mb-4 animate-pulse"
          />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Tuna
            width={60}
            height={60}
            className="text-foreground mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to access this page.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Go to Home
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="relative py-8">
        <div className="flex flex-col items-center gap-2">
          <Tuna width={80} height={80} className="text-foreground" />
          <h1 className="text-4xl font-bold uppercase tracking-wider">
            Life Tuna
          </h1>
        </div>
        <div className="absolute top-8 right-8">
          <ProfileIcon />
        </div>
      </header>

      <section className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
              Complete
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts here..."
              value={responses[currentQuestion] || ""}
              onChange={(e) =>
                handleResponseChange(currentQuestion, e.target.value)
              }
              className="min-h-[120px]"
            />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!responses[currentQuestion]?.trim()}
              >
                {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
