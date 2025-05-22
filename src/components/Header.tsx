
import { ThemeToggle } from "./theme/ThemeToggle";
import { Button } from "./ui/button";

interface HeaderProps {
  onReset: () => void;
  onImportNew: () => void;
  isDeckLoaded: boolean;
}

export function Header({ onReset, onImportNew, isDeckLoaded }: HeaderProps) {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight">Quanda Web</h1>
      </div>
      <div className="flex items-center space-x-4">
        {isDeckLoaded && (
          <Button 
            variant="outline" 
            onClick={onReset}
            className="text-sm"
          >
            Reset Deck
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={onImportNew}
          className="text-sm"
        >
          Import New Deck
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
