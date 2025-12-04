
import { ThemeToggle } from "./theme/ThemeToggle";
import { Button } from "./ui/button";
import { RotateCw, Import } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  onImportNew: () => void;
  isDeckLoaded: boolean;
}

export function Header({ onReset, onImportNew, isDeckLoaded }: HeaderProps) {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Quanda</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        {isDeckLoaded && (
          <Button
            variant="outline"
            onClick={onReset}
            size="icon"
            className="md:h-10 md:w-auto md:px-4 md:py-2"
          >
            <RotateCw className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Reset Deck</span>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onImportNew}
          size="icon"
          className="md:h-10 md:w-auto md:px-4 md:py-2"
        >
          <Import className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Import New Deck</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
