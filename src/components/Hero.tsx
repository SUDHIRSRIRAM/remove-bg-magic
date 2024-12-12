import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <div className="hero-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Free Background Removal
          <br />
          <span className="text-primary">In Seconds</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Remove backgrounds from images instantly with our AI-powered tool. No signup
          required, 100% free for basic use.
        </p>
        <Button
          size="lg"
          className="text-lg px-8 py-6"
          onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Start Removing Background <ArrowDown className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};