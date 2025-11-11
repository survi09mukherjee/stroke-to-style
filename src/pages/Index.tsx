import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RailwayTrack } from "@/components/RailwayTrack";
import { SpeedDisplay } from "@/components/SpeedDisplay";
import { SignalStatus } from "@/components/SignalStatus";
import { CollisionDetection } from "@/components/CollisionDetection";
import { CommunicationPanel } from "@/components/CommunicationPanel";
import { AutoSignalResponse } from "@/components/AutoSignalResponse";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { toast } from "@/hooks/use-toast";

interface TrainState {
  id: string;
  label: string;
  color: string;
  fixedPosition: number;
  speed: number;
  direction: "up" | "down";
  distance: number;
}

const Index = () => {
  const [stoppingTrains, setStoppingTrains] = useState<Set<string>>(new Set());
  const [trackOffset, setTrackOffset] = useState(0);
  
  const [trains, setTrains] = useState<TrainState[]>([
    { id: "train-a", label: "TRAIN A", color: "#00d4ff", fixedPosition: 50, speed: 72, direction: "up", distance: 3.2 },
    { id: "train-b", label: "TRAIN B", color: "#ff9500", fixedPosition: 50, speed: 60, direction: "down", distance: 5.1 },
    { id: "train-c", label: "TRAIN C", color: "#ff3366", fixedPosition: 50, speed: 45, direction: "up", distance: 8.3 },
  ]);

  const [oncomingTrains, setOncomingTrains] = useState([
    { id: "oncoming-1", trackIndex: 0, position: 30, color: "#9b59b6" },
    { id: "oncoming-2", trackIndex: 1, position: 70, color: "#e74c3c" },
  ]);

  const [stations] = useState([
    { trackIndex: 0, position: 40, name: "STATION A" },
    { trackIndex: 1, position: 60, name: "STATION B" },
    { trackIndex: 2, position: 80, name: "STATION C" },
  ]);

  // Calculate collision risk based on opposite direction trains
  const calculateCollisionRisk = () => {
    let minDistance = Infinity;
    let hasOppositeCollision = false;

    // Check for opposite direction trains on same track
    const trackGroups: Record<number, TrainState[]> = { 0: [], 1: [], 2: [] };
    trains.forEach((train, idx) => {
      trackGroups[idx].push(train);
    });

    // Check each track for collision with oncoming trains
    oncomingTrains.forEach(oncoming => {
      const train = trains[oncoming.trackIndex];
      if (train && train.direction === "up") {
        // Simplified distance calculation
        const distance = Math.abs(50 - oncoming.position) * 0.1; // Convert to km
        minDistance = Math.min(minDistance, distance);
        if (distance < 2) {
          hasOppositeCollision = true;
        }
      }
    });

    // Base distance on train separation
    trains.forEach(train => {
      minDistance = Math.min(minDistance, train.distance);
    });

    let riskLevel: "safe" | "warning" | "danger" = "safe";
    if (hasOppositeCollision || minDistance < 1) riskLevel = "danger";
    else if (minDistance < 2) riskLevel = "warning";

    return { riskLevel, minDistanceKm: minDistance };
  };

  const { riskLevel, minDistanceKm } = calculateCollisionRisk();

  // Animate track movement
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackOffset(prev => (prev + 0.5) % 100);
      
      // Update train distances dynamically
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          distance: train.speed > 0 ? Math.max(0.1, train.distance - 0.01) : train.distance
        }))
      );

      // Move oncoming trains
      setOncomingTrains(prev => 
        prev.map(train => ({
          ...train,
          position: (train.position + 0.3) % 100
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Handle emergency stopping for individual trains
  useEffect(() => {
    if (stoppingTrains.size === 0) return;

    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => {
          if (stoppingTrains.has(train.id) && train.speed > 0) {
            const newSpeed = Math.max(0, train.speed - 5);
            
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

  const handleEmergencyStop = (trainId: string) => {
    const train = trains.find(t => t.id === trainId);
    if (!train || stoppingTrains.has(trainId) || train.speed === 0) return;

    setStoppingTrains(prev => new Set(prev).add(trainId));

    toast({
      title: "🚨 EMERGENCY STOP ACTIVATED",
      description: `${train.label}: Emergency brake engaged`,
      variant: "destructive",
    });
  };

  // Check for collision warnings per train
  const getTrainCollisionWarning = (trackIndex: number) => {
    const train = trains[trackIndex];
    const oncoming = oncomingTrains.find(t => t.trackIndex === trackIndex);
    
    if (train && oncoming && train.direction === "up") {
      const distance = Math.abs(50 - oncoming.position) * 0.1;
      return distance < 2;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-3 overflow-hidden">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-center tracking-wider">
          SMART RAIL-TRACKING AND ANTI-COLLISION SYSTEM
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-[1800px] mx-auto h-[calc(100vh-100px)]">
        {/* Main Track Visualization */}
        <div className="lg:col-span-2 space-y-3 overflow-hidden">
          {/* Railway Tracks */}
          <Card className="p-4 bg-card border-border">
            <div className="space-y-2">
              <RailwayTrack
                name="TRACK A"
                train={trains[0]}
                trackOffset={trackOffset}
                collisionWarning={getTrainCollisionWarning(0)}
                oncomingTrains={oncomingTrains.filter(t => t.trackIndex === 0)}
                stations={stations.filter(s => s.trackIndex === 0)}
              />
              <RailwayTrack
                name="TRACK B"
                train={trains[1]}
                trackOffset={trackOffset}
                collisionWarning={getTrainCollisionWarning(1)}
                oncomingTrains={oncomingTrains.filter(t => t.trackIndex === 1)}
                stations={stations.filter(s => s.trackIndex === 1)}
              />
              <RailwayTrack
                name="TRACK C"
                train={trains[2]}
                trackOffset={trackOffset}
                collisionWarning={getTrainCollisionWarning(2)}
                oncomingTrains={oncomingTrains.filter(t => t.trackIndex === 2)}
                stations={stations.filter(s => s.trackIndex === 2)}
              />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <AutoSignalResponse />
            <AnalyticsDashboard />
          </div>
        </div>

        {/* Right Sidebar - Metrics */}
        <div className="space-y-3 overflow-hidden">
          <SpeedDisplay 
            trains={trains}
            onStopTrain={handleEmergencyStop}
            stoppingTrains={stoppingTrains}
          />
          <SignalStatus distance={minDistanceKm} />
          <CollisionDetection riskLevel={riskLevel} minDistance={minDistanceKm} />
          <CommunicationPanel
            trains={trains.map(t => ({ 
              trainId: parseInt(t.id.split('-')[1] === 'a' ? '72' : t.id.split('-')[1] === 'b' ? '60' : '45'), 
              distance: `${t.distance.toFixed(1)} KM` 
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
