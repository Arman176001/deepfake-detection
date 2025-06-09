
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { ResultDisplay } from "@/components/ResultDisplay";
import { FeedbackForm } from "@/components/FeedbackForm";

interface PredictionResult {
  result: string;
  confidence: number;
  prediction_id: string;
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    setFeedbackSubmitted(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      console.error('Error analyzing file:', error);
      // You could add toast notification here
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedbackSubmit = async (feedback: { user_actual_result: string; user_score: number }) => {
    if (!result) return;

    try {
      const response = await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prediction_id: result.prediction_id,
          user_actual_result: feedback.user_actual_result,
          score: feedback.user_score,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const resetFlow = () => {
    setResult(null);
    setFeedbackSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Deepfake Detector
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image or video to detect if it contains deepfake content using advanced AI technology
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!result && !isAnalyzing && (
            <Card className="p-8 animate-scale-in">
              <FileUpload onFileUpload={handleFileUpload} />
            </Card>
          )}

          {isAnalyzing && (
            <Card className="p-8 animate-fade-in">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Content</h3>
                <p className="text-muted-foreground">
                  Our AI is examining your file for deepfake patterns...
                </p>
              </div>
            </Card>
          )}

          {result && !feedbackSubmitted && (
            <div className="space-y-6">
              <ResultDisplay result={result} onReset={resetFlow} />
              <Card className="p-6 animate-slide-in-right">
                <FeedbackForm onSubmit={handleFeedbackSubmit} />
              </Card>
            </div>
          )}

          {feedbackSubmitted && (
            <Card className="p-8 text-center animate-fade-in">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                Your feedback helps us improve our detection accuracy.
              </p>
              <button
                onClick={resetFlow}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Analyze Another File
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
