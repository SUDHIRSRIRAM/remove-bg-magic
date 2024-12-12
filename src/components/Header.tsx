import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              BackgroundBegone
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
            </Link>
            <Button asChild>
              <Link to="/try-now" className="ml-4">
                Try Now - It's Free!
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};