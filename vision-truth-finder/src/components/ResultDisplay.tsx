
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, ArrowLeft } from "lucide-react";

interface PredictionResult {
  result: string;
  confidence: number;
  prediction_id: string;
}

interface ResultDisplayProps {
  result: PredictionResult;
  onReset: () => void;
}

export const ResultDisplay = ({ result, onReset }: ResultDisplayProps) => {
  const isFake = result.result.toLowerCase() === 'fake';
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  return (
    <Card className="p-8 animate-scale-in">
      <div className="text-center">
        {/* Result Icon */}
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
          isFake 
            ? 'bg-destructive/10 text-destructive' 
            : 'bg-green-500/10 text-green-500'
        }`}>
          {isFake ? (
            <AlertTriangle className="w-10 h-10" />
          ) : (
            <Shield className="w-10 h-10" />
          )}
        </div>

        {/* Result Text */}
        <h2 className={`text-3xl font-bold mb-2 ${
          isFake ? 'text-destructive' : 'text-green-500'
        }`}>
          {isFake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC CONTENT'}
        </h2>

        <p className="text-muted-foreground mb-6">
          {isFake 
            ? 'This content appears to be artificially generated or manipulated'
            : 'This content appears to be genuine and unmanipulated'
          }
        </p>

        {/* Confidence Score */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Confidence Score</span>
            <span className="text-sm font-bold">{confidencePercentage}%</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                isFake ? 'bg-destructive' : 'bg-green-500'
              }`}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Higher confidence indicates stronger certainty in the prediction
          </p>
        </div>

        {/* Prediction ID */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Prediction ID</p>
          <code className="text-sm font-mono">{result.prediction_id}</code>
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={onReset}
          className="hover-scale"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Analyze Another File
        </Button>
      </div>
    </Card>
  );
};
