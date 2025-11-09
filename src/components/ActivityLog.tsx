import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Clock, AlertTriangle, CheckCircle, Signal } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "emergency" | "signal" | "system";
  message: string;
  icon: any;
  color: string;
}

export const ActivityLog = () => {
  const logs: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date().toLocaleTimeString(),
      type: "system",
      message: "System initialized successfully",
      icon: CheckCircle,
      color: "text-signal-safe"
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      type: "signal",
      message: "TRACK-B right signal changed to caution",
      icon: Signal,
      color: "text-signal-warning"
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
      type: "system",
      message: "All trains operational",
      icon: CheckCircle,
      color: "text-signal-safe"
    }
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground tracking-wider">ACTIVITY LOG</h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-3">
          {logs.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="flex gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${log.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
