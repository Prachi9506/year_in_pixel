import { useState, useEffect, useCallback } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { Legend } from './Legend';
import { YearStats } from './YearStats';
import { YearNavigator } from './YearNavigator';
import {
  type ProductivityLevel,
  loadYearData,
  saveProductivity,
  getYearStats,
  formatDateKey,
} from '@/lib/productivity-storage';

export function YearInPixels() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [data, setData] = useState<Record<string, ProductivityLevel>>({});
  const [stats, setStats] = useState(() => getYearStats(year));
  
  // Load data when year changes
  useEffect(() => {
    setData(loadYearData(year));
    setStats(getYearStats(year));
  }, [year]);
  
  const handleDayChange = useCallback((date: Date, level: ProductivityLevel) => {
    saveProductivity(date, level);
    
    setData((prev) => {
      const key = formatDateKey(date);
      const updated = { ...prev };
      if (level === null) {
        delete updated[key];
      } else {
        updated[key] = level;
      }
      return updated;
    });
    
    setStats(getYearStats(date.getFullYear()));
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-productivity-high to-productivity-medium flex items-center justify-center">
              <span className="text-sm font-bold text-background">Y</span>
            </div>
            <h1 className="text-lg font-semibold">Year in Pixels</h1>
          </div>
          <YearNavigator year={year} onYearChange={setYear} />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <YearStats stats={stats} />
          
          {/* Calendar */}
          <div className="glass-card p-6">
            <CalendarGrid year={year} data={data} onDayChange={handleDayChange} />
          </div>
          
          {/* Legend */}
          <div className="flex justify-center">
            <Legend />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          Track your daily productivity. Click any past or current day to log.
        </div>
      </footer>
    </div>
  );
}
