import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  type ProductivityLevel,
  isToday,
  isPastDate,
  isFutureDate,
} from '@/lib/productivity-storage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DayCellProps {
  date: Date;
  productivity: ProductivityLevel;
  onProductivityChange: (level: ProductivityLevel) => void;
}

const productivityOptions: { level: ProductivityLevel; label: string; emoji: string }[] = [
  { level: 'high', label: 'High', emoji: '🟢' },
  { level: 'medium', label: 'Medium', emoji: '🟠' },
  { level: 'low', label: 'Low', emoji: '🔴' },
];

export function DayCell({ date, productivity, onProductivityChange }: DayCellProps) {
  const [open, setOpen] = useState(false);
  
  const today = isToday(date);
  const past = isPastDate(date);
  const future = isFutureDate(date);
  const clickable = !future;
  
  const getCellClass = () => {
    if (future) return 'pixel-cell-future';
    if (productivity === 'high') return 'pixel-cell-high';
    if (productivity === 'medium') return 'pixel-cell-medium';
    if (productivity === 'low') return 'pixel-cell-low';
    if (past || today) return 'pixel-cell-unmarked';
    return 'pixel-cell-future';
  };
  
  const handleSelect = (level: ProductivityLevel) => {
    onProductivityChange(level);
    setOpen(false);
  };
  
  const cell = (
    <div
      className={cn(
        'pixel-cell',
        getCellClass(),
        clickable && 'pixel-cell-clickable',
        today && 'ring-2 ring-offset-1 ring-offset-background',
        !future && 'hover:ring-1 hover:ring-foreground/30'
      )}
      style={today ? { 
        '--tw-ring-color': 'hsl(200 80% 60%)' 
      } as React.CSSProperties : undefined}
      title={format(date, 'MMM d, yyyy')}
    />
  );
  
  if (!clickable) {
    return cell;
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {cell}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2 animate-scale-in" 
        align="center"
        sideOffset={8}
      >
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center font-medium">
            {format(date, 'EEEE, MMM d')}
          </p>
          <div className="flex gap-1">
            {productivityOptions.map(({ level, label, emoji }) => (
              <button
                key={level}
                onClick={() => handleSelect(level)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                  'hover:bg-accent',
                  productivity === level && 'bg-accent ring-1 ring-foreground/20'
                )}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
          {productivity && (
            <button
              onClick={() => handleSelect(null)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              Clear
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
