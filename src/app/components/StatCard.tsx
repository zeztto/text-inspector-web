import { Card } from "./ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm mb-1">{label}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
        {icon && (
          <div className="text-muted-foreground ml-2">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
