import { Circle, Radio, Square } from "lucide-react";

export const LegendBar = () => {
  const legends = [
    { icon: <Circle className="w-3 h-3 text-rfid-active fill-rfid-active" />, label: "Active RFID Module" },
    { icon: <Square className="w-3 h-3 text-rfid-passive fill-rfid-passive" />, label: "Passive RFID Module" },
    { icon: <Radio className="w-3 h-3 text-rfid-active" />, label: "Wireless Communication" },
    { icon: <Circle className="w-3 h-3 text-signal-safe fill-signal-safe" />, label: "Safe Signal" },
    { icon: <Circle className="w-3 h-3 text-signal-stop fill-signal-stop" />, label: "Stop Signal" },
  ];

  return (
    <div className="flex items-center justify-center gap-8 py-4 px-6 bg-card/50 rounded-lg border border-border">
      {legends.map((legend, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {legend.icon}
          <span className="text-xs text-muted-foreground">{legend.label}</span>
        </div>
      ))}
    </div>
  );
};
