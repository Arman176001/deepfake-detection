
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { ResultDisplay } from "@/components/ResultDisplay";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Github, ExternalLink, Coffee } from "lucide-react";

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

      const response = await fetch("http://localhost:8000/predict", {  
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
      const response = await fetch("http://localhost:8000/feedback", {
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
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

      {/* Fixed Social Links - Bottom Right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a
          href="https://github.com/Arman176001/deepfake-detection"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-12 h-12 bg-muted/80 backdrop-blur-sm hover:bg-muted rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:w-24 shadow-lg"
        >
          <Github className="w-5 h-5 text-foreground group-hover:mr-2 transition-all duration-300" />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            GitHub
          </span>
        </a>
        
        <a
          href="https://www.kaggle.com/models/armanchaudhary/xception5o"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-12 h-12 bg-muted/80 backdrop-blur-sm hover:bg-muted rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:w-20 shadow-lg"
        >
          <ExternalLink className="w-5 h-5 text-foreground group-hover:mr-2 transition-all duration-300" />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            Model
          </span>
        </a>
        
        <a
          href="https://buymeacoffee.com/arman176"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-12 h-12 bg-yellow-500/20 backdrop-blur-sm hover:bg-yellow-500/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:w-20 shadow-lg"
        >
          <Coffee className="w-5 h-5 text-yellow-600 dark:text-yellow-400 group-hover:mr-2 transition-all duration-300" />
          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            Coffee
          </span>
        </a>
      </div>
    </div>
  );
};

export default Index;
