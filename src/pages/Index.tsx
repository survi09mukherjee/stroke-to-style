import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RailwayTrack } from "@/components/RailwayTrack";
import { SpeedDisplay } from "@/components/SpeedDisplay";
import { SignalStatus } from "@/components/SignalStatus";
import { CommunicationPanel } from "@/components/CommunicationPanel";
import { AutoSignalResponse } from "@/components/AutoSignalResponse";
import { LegendBar } from "@/components/LegendBar";
import { Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isEmergencyStopping, setIsEmergencyStopping] = useState(false);

  const handleEmergencyStop = async () => {
    if (isEmergencyStopping) return;
    
    setIsEmergencyStopping(true);

    // First notification: Emergency brake initialization
    toast({
      title: "🚨 EMERGENCY STOP ACTIVATED",
      description: "Emergency brake initialization...",
      variant: "destructive",
    });

    // Second notification after 2 seconds: Slowing vehicle
    setTimeout(() => {
      toast({
        title: "⚠️ BRAKING IN PROGRESS",
        description: "Slowing vehicle... Speed reducing rapidly.",
        variant: "destructive",
      });
    }, 2000);

    // Final notification after 4 seconds: Vehicle stopped
    setTimeout(() => {
      toast({
        title: "✓ VEHICLE STOPPED",
        description: "All trains have been brought to a complete stop safely.",
      });
      setIsEmergencyStopping(false);
    }, 4000);
  };

  const trackAModules = [
    { id: "a1", type: "active" as const, label: "RFID A1" },
    { id: "a2", type: "wireless" as const, label: "DA" },
    { id: "a3", type: "active" as const, label: "RFID A2" },
    { id: "a4", type: "passive" as const, label: "RFID A4" },
  ];

  const trackBModules = [
    { id: "b1", type: "active" as const, label: "RFID B1" },
    { id: "b2", type: "passive" as const, label: "RFID B2" },
    { id: "b3", type: "wireless" as const, label: "Wireless" },
    { id: "b4", type: "active" as const, label: "RFID B3" },
    { id: "b5", type: "active" as const, label: "RFID B4" },
  ];

  const trackCModules = [
    { id: "c1", type: "active" as const, label: "RFID C1" },
    { id: "c2", type: "active" as const, label: "RFID C2" },
    { id: "c3", type: "epc" as const, label: "EPC RFID" },
    { id: "c4", type: "wireless" as const, label: "Wireless" },
    { id: "c5", type: "passive" as const, label: "RFID C4" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center tracking-wider mb-2">
          SMART RAIL-TRACKING AND ANTI-COLLISION SYSTEM
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1800px] mx-auto">
        {/* Main Track Visualization */}
        <div className="lg:col-span-2 space-y-4">
          {/* Power Supply Labels */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-accent">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">110V DC - RFID Power Supply</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <span className="text-sm font-medium">110V DC - RFID Power Supply</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>

          {/* Railway Tracks */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <RailwayTrack
                name="TRACK A"
                train={{
                  id: "train-a",
                  label: "TRAIN A",
                  status: "Active",
                  color: "train-a",
                  position: 40,
                }}
                rfidModules={trackAModules}
                showStation
              />
              <RailwayTrack
                name="TRACK B"
                train={{
                  id: "train-b",
                  label: "TRAIN B",
                  status: "Active",
                  color: "train-b",
                  position: 55,
                }}
                rfidModules={trackBModules}
                hasStopSignal
              />
              <RailwayTrack
                name="TRACK C"
                train={{
                  id: "train-c",
                  label: "TRAIN C",
                  status: "Active",
                  color: "train-c",
                  position: 70,
                }}
                rfidModules={trackCModules}
                showCabin
              />
            </div>
            
            {/* Legend */}
            <div className="mt-8">
              <LegendBar />
            </div>
          </Card>

          {/* Auto Signal Response */}
          <AutoSignalResponse />
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="space-y-4">
          <SpeedDisplay speed={72} />
          <SignalStatus distance={2} />
          <CommunicationPanel
            trains={[
              { trainId: 72, distance: "< 3 KM" },
              { trainId: 36, distance: "< 3 KM" },
            ]}
          />
          <Button
            onClick={handleEmergencyStop}
            disabled={isEmergencyStopping}
            className="w-full h-16 text-lg font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
          >
            {isEmergencyStopping ? "STOPPING..." : "EMERGENCY STOP"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
