import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center space-y-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-brand-maroon/10 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-primary dark:text-brand-maroon" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="text-slate-500 dark:text-slate-400">
          This page doesn't exist in UCANDO. The route <code className="font-mono text-xs bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{location.pathname}</code> couldn't be found.
        </p>
        <Link to="/">
          <Button className="bg-primary dark:bg-brand-maroon text-white">
            Return to Integration Hub
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
