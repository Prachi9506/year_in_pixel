import { useMemo } from 'react';
import { format, startOfYear, addDays, getDay } from 'date-fns';
import { DayCell } from './DayCell';
import {
  type ProductivityLevel,
  loadYearData,
  formatDateKey,
} from '@/lib/productivity-storage';

interface CalendarGridProps {
  year: number;
  data: Record<string, ProductivityLevel>;
  onDayChange: (date: Date, level: ProductivityLevel) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CalendarGrid({ year, data, onDayChange }: CalendarGridProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const startDate = startOfYear(new Date(year, 0, 1));
    const startDayOfWeek = getDay(startDate);
    
    // Build weeks array (each week is an array of 7 days, some might be null)
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = new Array(startDayOfWeek).fill(null);
    
    let currentDate = startDate;
    while (currentDate.getFullYear() === year) {
      currentWeek.push(currentDate);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    // Fill the last week if incomplete
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    // Calculate month label positions
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find((d) => d !== null);
      if (firstDayOfWeek) {
        const month = firstDayOfWeek.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ month: MONTHS[month], weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return { weeks, monthLabels };
  }, [year]);
  
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-fit">
        {/* Month labels */}
        <div className="flex mb-2 ml-10">
          <div className="flex" style={{ gap: '3px' }}>
            {weeks.map((_, weekIndex) => {
              const label = monthLabels.find((m) => m.weekIndex === weekIndex);
              return (
                <div key={weekIndex} className="w-3 text-xs text-muted-foreground">
                  {label?.month}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Calendar grid */}
        <div className="flex">
          {/* Weekday labels */}
          <div className="flex flex-col mr-2" style={{ gap: '3px' }}>
            {WEEKDAYS.map((day, index) => (
              <div 
                key={day} 
                className="h-3 text-xs text-muted-foreground flex items-center justify-end pr-1"
                style={{ visibility: index % 2 === 1 ? 'visible' : 'hidden' }}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid of days */}
          <div className="flex" style={{ gap: '3px' }}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col" style={{ gap: '3px' }}>
                {week.map((date, dayIndex) => (
                  <div key={dayIndex} className="w-3 h-3">
                    {date && (
                      <DayCell
                        date={date}
                        productivity={data[formatDateKey(date)] || null}
                        onProductivityChange={(level) => onDayChange(date, level)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
