import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RailwayTrack } from "@/components/RailwayTrack";
import { SpeedDisplay } from "@/components/SpeedDisplay";
import { SignalStatus } from "@/components/SignalStatus";
import { CommunicationPanel } from "@/components/CommunicationPanel";
import { AutoSignalResponse } from "@/components/AutoSignalResponse";
import { TrainControls } from "@/components/TrainControls";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [stoppingTrains, setStoppingTrains] = useState<Set<string>>(new Set());
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
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          position: train.position >= 95 ? 5 : train.position + (train.speed / 1000)
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAnimating]);

  // Handle emergency stopping for individual trains
  useEffect(() => {
    if (stoppingTrains.size === 0) return;

    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => {
          if (stoppingTrains.has(train.id) && train.speed > 0) {
            const newSpeed = Math.max(0, train.speed - 5);
            
            // Show notification when train fully stops
            if (newSpeed === 0 && train.speed > 0) {
              setTimeout(() => {
                toast({
                  title: "✓ TRAIN STOPPED",
                  description: `${train.label} has been brought to a complete stop safely.`,
                });
                setStoppingTrains(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(train.id);
                  return newSet;
                });
              }, 100);
            }
            
            return { ...train, speed: newSpeed };
          }
          return train;
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [stoppingTrains]);

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

  const handleEmergencyStop = (trainId: string) => {
    const train = trains.find(t => t.id === trainId);
    if (!train || stoppingTrains.has(trainId)) return;

    setStoppingTrains(prev => new Set(prev).add(trainId));

    // First notification: Emergency brake initialization
    toast({
      title: "🚨 EMERGENCY STOP ACTIVATED",
      description: `${train.label}: Emergency brake initialization...`,
      variant: "destructive",
    });

    // Second notification after 2 seconds: Slowing vehicle
    setTimeout(() => {
      toast({
        title: "⚠️ BRAKING IN PROGRESS",
        description: `${train.label}: Speed reducing rapidly.`,
        variant: "destructive",
      });
    }, 2000);
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
          
          {/* Analytics Dashboard */}
          <AnalyticsDashboard />
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="space-y-4">
          <SpeedDisplay 
            trains={trains.map(t => ({ 
              id: t.id, 
              label: t.label, 
              color: t.color, 
              speed: t.speed 
            }))} 
            maxSpeed={120} 
          />
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-full h-16 text-lg font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg"
              >
                EMERGENCY STOP
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {trains.map((train) => (
                <DropdownMenuItem
                  key={train.id}
                  onClick={() => handleEmergencyStop(train.id)}
                  disabled={stoppingTrains.has(train.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: train.color }}
                    />
                    <span>{train.label}</span>
                    {stoppingTrains.has(train.id) && (
                      <span className="ml-auto text-xs text-muted-foreground">Stopping...</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Index;
