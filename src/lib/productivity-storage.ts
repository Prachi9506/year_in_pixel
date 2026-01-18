export type ProductivityLevel = 'high' | 'medium' | 'low' | null;

const STORAGE_KEY = 'year-in-pixels-data';

interface ProductivityData {
  [dateKey: string]: ProductivityLevel;
}

export function getStorageKey(year: number): string {
  return `${STORAGE_KEY}-${year}`;
}

export function loadYearData(year: number): ProductivityData {
  try {
    const data = localStorage.getItem(getStorageKey(year));
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveProductivity(date: Date, level: ProductivityLevel): void {
  const year = date.getFullYear();
  const dateKey = formatDateKey(date);
  const data = loadYearData(year);
  
  if (level === null) {
    delete data[dateKey];
  } else {
    data[dateKey] = level;
  }
  
  localStorage.setItem(getStorageKey(year), JSON.stringify(data));
}

export function getProductivity(date: Date): ProductivityLevel {
  const year = date.getFullYear();
  const dateKey = formatDateKey(date);
  const data = loadYearData(year);
  return data[dateKey] || null;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate > today;
}

export function getDaysInYear(year: number): number {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
}

export function getYearStats(year: number): {
  total: number;
  high: number;
  medium: number;
  low: number;
  unmarked: number;
  remaining: number;
} {
  const data = loadYearData(year);
  const totalDays = getDaysInYear(year);
  const today = new Date();
  const currentYear = today.getFullYear();
  
  let high = 0;
  let medium = 0;
  let low = 0;
  
  Object.values(data).forEach((level) => {
    if (level === 'high') high++;
    else if (level === 'medium') medium++;
    else if (level === 'low') low++;
  });
  
  const colored = high + medium + low;
  
  // Calculate days passed in the year
  let daysPassed: number;
  if (year < currentYear) {
    daysPassed = totalDays;
  } else if (year > currentYear) {
    daysPassed = 0;
  } else {
    const startOfYear = new Date(year, 0, 1);
    const diffTime = today.getTime() - startOfYear.getTime();
    daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  
  const unmarked = Math.max(0, daysPassed - colored);
  const remaining = totalDays - daysPassed;
  
  return {
    total: totalDays,
    high,
    medium,
    low,
    unmarked,
    remaining: Math.max(0, remaining),
  };
}
