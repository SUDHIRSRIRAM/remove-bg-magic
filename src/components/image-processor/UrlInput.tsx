import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "lucide-react";

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
}

export const UrlInput = ({ onUrlSubmit }: UrlInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onUrlSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        placeholder="Enter image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!url}>
        <Link className="w-4 h-4 mr-2" />
        Process URL
      </Button>
    </form>
  );
};