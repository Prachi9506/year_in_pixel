import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YearNavigatorProps {
  year: number;
  onYearChange: (year: number) => void;
}

export function YearNavigator({ year, onYearChange }: YearNavigatorProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onYearChange(year - 1)}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold tabular-nums">{year}</h2>
        {year === currentYear && (
          <span className="text-xs bg-productivity-high/20 text-productivity-high px-2 py-0.5 rounded-full">
            Current
          </span>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onYearChange(year + 1)}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {year !== currentYear && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onYearChange(currentYear)}
          className="ml-2 h-7 text-xs"
        >
          Today
        </Button>
      )}
    </div>
  );
}
