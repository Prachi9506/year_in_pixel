interface YearStatsProps {
  stats: {
    total: number;
    high: number;
    medium: number;
    low: number;
    unmarked: number;
    remaining: number;
  };
}

export function YearStats({ stats }: YearStatsProps) {
  const colored = stats.high + stats.medium + stats.low;
  const productivity = colored > 0 
    ? Math.round((stats.high * 100 + stats.medium * 50 + stats.low * 10) / colored)
    : 0;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        label="Days Tracked"
        value={colored}
        subtext={`of ${stats.total}`}
        accent="text-productivity-high"
      />
      <StatCard
        label="High Days"
        value={stats.high}
        emoji="🟢"
        accent="text-productivity-high"
      />
      <StatCard
        label="Days Remaining"
        value={stats.remaining}
        subtext="in year"
        accent="text-muted-foreground"
      />
      <StatCard
        label="Productivity"
        value={`${productivity}%`}
        subtext="average"
        accent="text-productivity-medium"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  emoji?: string;
  accent?: string;
}

function StatCard({ label, value, subtext, emoji, accent }: StatCardProps) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        {emoji && <span className="text-lg">{emoji}</span>}
        <span className={`text-2xl font-semibold ${accent}`}>{value}</span>
        {subtext && (
          <span className="text-xs text-muted-foreground">{subtext}</span>
        )}
      </div>
    </div>
  );
}
