import { Card } from "./ui/card";
import { AlertTriangle, Shield } from "lucide-react";

interface CollisionDetectionProps {
  riskLevel: "safe" | "warning" | "danger";
  minDistance?: number;
}

export const CollisionDetection = ({ riskLevel, minDistance = 1.8 }: CollisionDetectionProps) => {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case "danger":
        return {
          icon: AlertTriangle,
          color: "text-signal-stop",
          bgColor: "bg-signal-stop/10",
          borderColor: "border-signal-stop/30",
          status: "COLLISION RISK",
          message: "Distance < 500m - Immediate action required"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-signal-warning",
          bgColor: "bg-signal-warning/10",
          borderColor: "border-signal-warning/30",
          status: "CAUTION",
          message: "Distance < 1km - Monitor closely"
        };
      default:
        return {
          icon: Shield,
          color: "text-signal-safe",
          bgColor: "bg-signal-safe/10",
          borderColor: "border-signal-safe/30",
          status: "SAFE",
          message: "All trains at safe distance"
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">COLLISION DETECTION</h3>
      
      <div className={`flex items-start gap-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
        <Icon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${config.color} ${riskLevel !== "safe" ? "animate-pulse" : ""}`} />
        <div className="flex-1">
          <p className={`text-lg font-semibold ${config.color} tracking-wide mb-1`}>
            {config.status}
          </p>
          <p className="text-sm text-muted-foreground">
            {config.message}
          </p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Minimum Distance</span>
          <span className={`font-medium ${
            riskLevel === "danger" ? "text-signal-stop" :
            riskLevel === "warning" ? "text-signal-warning" :
            "text-foreground"
          }`}>
            {minDistance.toFixed(2)} km
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Monitoring Status</span>
          <span className="text-signal-safe font-medium">ACTIVE</span>
        </div>
      </div>
    </Card>
  );
};
