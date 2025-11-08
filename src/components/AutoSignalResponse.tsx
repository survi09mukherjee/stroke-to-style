import { Bell } from "lucide-react";
import { Card } from "./ui/card";

export const AutoSignalResponse = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-sm font-medium text-muted-foreground tracking-wider mb-4">AUTO SIGNAL RESPONSE</h3>
      <div className="flex items-center gap-4 p-4 bg-alert-bg rounded-lg border border-alert-text/20">
        <Bell className="w-8 h-8 text-alert-text animate-pulse" />
        <span className="text-lg font-semibold text-alert-text tracking-wide">AUTO BRAKE ACTIVATED</span>
      </div>
    </Card>
  );
};
