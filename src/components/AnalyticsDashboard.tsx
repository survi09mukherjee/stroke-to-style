import { Card } from "./ui/card";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";

export const AnalyticsDashboard = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">ANALYTICS DASHBOARD</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-signal-safe" />
            <span className="text-xs text-muted-foreground">Active Trains</span>
          </div>
          <p className="text-2xl font-bold text-foreground">3</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Avg Speed</span>
          </div>
          <p className="text-2xl font-bold text-foreground">59 km/h</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-signal-warning" />
            <span className="text-xs text-muted-foreground">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-foreground">0</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">System Status</span>
            <span className="text-signal-safe font-medium">OPERATIONAL</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Update</span>
            <span className="text-foreground">Real-time</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
