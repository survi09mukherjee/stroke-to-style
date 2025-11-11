import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RailwayTrack } from "@/components/RailwayTrack";
import { SpeedDisplay } from "@/components/SpeedDisplay";
import { SignalStatus } from "@/components/SignalStatus";
import { CommunicationPanel } from "@/components/CommunicationPanel";
import { AutoSignalResponse } from "@/components/AutoSignalResponse";
import { TrainControls } from "@/components/TrainControls";
import { toast } from "@/hooks/use-toast";

interface TrainState {
  id: string;
  label: string;
  color: string;
  position: number;
  speed: number;
}

interface SignalState {
  left: "safe" | "caution" | "danger";
  right: "safe" | "caution" | "danger";
}

const Index = () => {
  const [isEmergencyStopping, setIsEmergencyStopping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  
  const [trains, setTrains] = useState<TrainState[]>([
    { id: "train-a", label: "TRAIN A", color: "#00d4ff", position: 20, speed: 72 },
    { id: "train-b", label: "TRAIN B", color: "#ff9500", position: 50, speed: 60 },
    { id: "train-c", label: "TRAIN C", color: "#ff3366", position: 75, speed: 45 },
  ]);
  
  const [signals, setSignals] = useState<Record<string, SignalState>>({
    "track-a": { left: "safe", right: "safe" },
    "track-b": { left: "safe", right: "caution" },
    "track-c": { left: "safe", right: "safe" },
  });

  // Animate train movement
  useEffect(() => {
    if (!isAnimating || isEmergencyStopping) return;
    
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          position: train.position >= 95 ? 5 : train.position + (train.speed / 1000)
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAnimating, isEmergencyStopping]);

  const handleSpeedChange = (trainId: string, newSpeed: number) => {
    setTrains(prevTrains =>
      prevTrains.map(train =>
        train.id === trainId ? { ...train, speed: newSpeed } : train
      )
    );
  };

  const handleSignalClick = (trackId: string, side: "left" | "right") => {
    setSignals(prev => {
      const currentSignal = prev[trackId][side];
      const nextSignal = 
        currentSignal === "safe" ? "caution" :
        currentSignal === "caution" ? "danger" : "safe";
      
      return {
        ...prev,
        [trackId]: {
          ...prev[trackId],
          [side]: nextSignal
        }
      };
    });
    
    toast({
      title: "Signal Updated",
      description: `${trackId.toUpperCase()} ${side} signal changed`,
    });
  };

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
          {/* Railway Tracks */}
          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <RailwayTrack
                name="TRACK A"
                train={trains[0]}
                signalLeft={signals["track-a"].left}
                signalRight={signals["track-a"].right}
                onSignalClick={(side) => handleSignalClick("track-a", side)}
              />
              <RailwayTrack
                name="TRACK B"
                train={trains[1]}
                signalLeft={signals["track-b"].left}
                signalRight={signals["track-b"].right}
                onSignalClick={(side) => handleSignalClick("track-b", side)}
              />
              <RailwayTrack
                name="TRACK C"
                train={trains[2]}
                signalLeft={signals["track-c"].left}
                signalRight={signals["track-c"].right}
                onSignalClick={(side) => handleSignalClick("track-c", side)}
              />
            </div>
          </Card>

          {/* Auto Signal Response */}
          <AutoSignalResponse />
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="space-y-4">
          <SpeedDisplay speed={Math.round(trains[0].speed)} maxSpeed={120} />
          <SignalStatus distance={2} />
          <TrainControls
            trains={trains.map(t => ({ 
              id: t.id, 
              name: t.label, 
              speed: t.speed, 
              color: t.color 
            }))}
            isAnimating={isAnimating}
            onSpeedChange={handleSpeedChange}
            onToggleAnimation={() => setIsAnimating(!isAnimating)}
          />
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
