import { cn } from '@/lib/utils';

const legendItems = [
  { label: 'High', className: 'pixel-cell-high' },
  { label: 'Medium', className: 'pixel-cell-medium' },
  { label: 'Low', className: 'pixel-cell-low' },
  { label: 'Unmarked', className: 'pixel-cell-unmarked' },
  { label: 'Future', className: 'pixel-cell-future' },
];

export function Legend() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-xs text-muted-foreground">Less</span>
      {legendItems.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={cn('w-3 h-3 rounded-sm', className)} />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
      <span className="text-xs text-muted-foreground">More</span>
    </div>
  );
}
