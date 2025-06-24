
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface FeedbackFormProps {
  onSubmit: (feedback: { user_actual_result: string; user_score: number }) => void;
}

export const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [actualResult, setActualResult] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const handleSubmit = () => {
    if (!actualResult || userScore === 0) {
      alert("Please select both the actual result and provide a rating.");
      return;
    }

    onSubmit({
      user_actual_result: actualResult,
      user_score: userScore,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Help Us Improve</h3>
        <p className="text-muted-foreground">
          Your feedback helps train our AI to be more accurate
        </p>
      </div>

      {/* Actual Result Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          What do you think the actual result should be?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActualResult("REAL")}
            className={`p-4 rounded-lg border-2 transition-all ${
              actualResult === "REAL"
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-muted hover:border-green-500/50"
            }`}
          >
            <div className="font-semibold">AUTHENTIC</div>
            <div className="text-sm text-muted-foreground">Real content</div>
          </button>
          <button
            onClick={() => setActualResult("FAKE")}
            className={`p-4 rounded-lg border-2 transition-all ${
              actualResult === "FAKE"
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-muted hover:border-destructive/50"
            }`}
          >
            <div className="font-semibold">DEEPFAKE</div>
            <div className="text-sm text-muted-foreground">Manipulated content</div>
          </button>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-3">
          How would you rate our prediction accuracy?
        </label>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setUserScore(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredStar || userScore)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {userScore === 0 && "Click to rate"}
          {userScore === 1 && "Poor"}
          {userScore === 2 && "Fair"}
          {userScore === 3 && "Good"}
          {userScore === 4 && "Very Good"}
          {userScore === 5 && "Excellent"}
        </p>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!actualResult || userScore === 0}
        className="w-full hover-scale"
        size="lg"
      >
        Submit Feedback
      </Button>
    </div>
  );
};
