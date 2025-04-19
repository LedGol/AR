import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Power,
  Fan,
  Droplets,
  Play,
  Pause,
  StopCircle,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import AnimatedGauge from "@/components/AnimatedGauge";
import DryingTimer from "@/components/DryingTimer";

const RoomDetailPage = () => {
  const { id = "1" } = useParams<{ id: string }>();

  // Mock data - in a real app, this would come from an API or context
  const [roomData, setRoomData] = useState({
    name: `Room ${id}`,
    connected: true,
    temperature: 25,
    humidity: 65,
    heaterOn: false,
    dryerOn: false,
    fanOn: false,
    automaticMode: false,
    targetTemperature: 30,
    targetHumidity: 40,
    dryingTimeMinutes: 120,
    dryingInProgress: false,
    dryingPaused: false,
    remainingTimeSeconds: 7200, // 120 minutes in seconds
  });

  // Toggle handlers
  const toggleHeater = () => {
    setRoomData((prev) => ({ ...prev, heaterOn: !prev.heaterOn }));
  };

  const toggleDryer = () => {
    setRoomData((prev) => ({ ...prev, dryerOn: !prev.dryerOn }));
  };

  const toggleFan = () => {
    setRoomData((prev) => ({ ...prev, fanOn: !prev.fanOn }));
  };

  // Input handlers
  const handleTargetTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomData((prev) => ({
      ...prev,
      targetTemperature: Number(e.target.value),
    }));
  };

  const handleTargetHumidityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRoomData((prev) => ({
      ...prev,
      targetHumidity: Number(e.target.value),
    }));
  };

  const handleDryingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = Number(e.target.value);
    setRoomData((prev) => ({
      ...prev,
      dryingTimeMinutes: minutes,
      remainingTimeSeconds: minutes * 60,
    }));
  };

  // Automatic drying control handlers
  const saveSettings = () => {
    // In a real app, this would send the settings to an API
    console.log("Saving settings:", {
      targetTemperature: roomData.targetTemperature,
      targetHumidity: roomData.targetHumidity,
      dryingTimeMinutes: roomData.dryingTimeMinutes,
    });
  };

  const startDrying = () => {
    setRoomData((prev) => ({
      ...prev,
      dryingInProgress: true,
      dryingPaused: false,
      remainingTimeSeconds: prev.dryingTimeMinutes * 60,
    }));
  };

  const pauseDrying = () => {
    setRoomData((prev) => ({ ...prev, dryingPaused: true }));
  };

  const resumeDrying = () => {
    setRoomData((prev) => ({ ...prev, dryingPaused: false }));
  };

  const stopDrying = () => {
    setRoomData((prev) => ({
      ...prev,
      dryingInProgress: false,
      dryingPaused: false,
    }));
  };

  const emergencyStop = () => {
    setRoomData((prev) => ({
      ...prev,
      heaterOn: false,
      dryerOn: false,
      fanOn: false,
      dryingInProgress: false,
      dryingPaused: false,
    }));
  };

  return (
    <div className="container mx-auto p-6 bg-background min-h-screen">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{roomData.name}</h1>
        <Badge
          variant={roomData.connected ? "default" : "destructive"}
          className="ml-4"
        >
          {roomData.connected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Gauges */}
        <div className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Current Conditions</CardTitle>
              <CardDescription>
                Real-time temperature and humidity readings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
              <div className="w-full max-w-[300px]">
                <AnimatedGauge
                  value={roomData.temperature}
                  min={0}
                  max={50}
                  label="Temperature"
                  unit="°C"
                  type="temperature"
                />
              </div>
              <div className="w-full max-w-[300px]">
                <AnimatedGauge
                  value={roomData.humidity}
                  min={0}
                  max={100}
                  label="Humidity"
                  unit="%"
                  type="humidity"
                />
              </div>
            </CardContent>
          </Card>

          {roomData.dryingInProgress && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Drying Progress</CardTitle>
                <CardDescription>
                  {roomData.dryingPaused
                    ? "Drying paused"
                    : "Drying in progress"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <DryingTimer
                  remainingSeconds={roomData.remainingTimeSeconds}
                  isPaused={roomData.dryingPaused}
                  onComplete={() =>
                    setRoomData((prev) => ({
                      ...prev,
                      dryingInProgress: false,
                    }))
                  }
                />
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                {roomData.dryingPaused ? (
                  <Button onClick={resumeDrying}>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={pauseDrying}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button variant="destructive" onClick={stopDrying}>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right column - Controls */}
        <div className="space-y-6">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Control</TabsTrigger>
              <TabsTrigger value="automatic">Automatic Control</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Control</CardTitle>
                  <CardDescription>
                    Directly control room equipment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card
                      className={`p-4 ${roomData.heaterOn ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" : ""}`}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-full ${roomData.heaterOn ? "bg-orange-100 dark:bg-orange-900/30" : "bg-muted"}`}
                        >
                          <Power
                            className={`h-8 w-8 ${roomData.heaterOn ? "text-orange-500" : "text-muted-foreground"}`}
                          />
                        </motion.div>
                        <h3 className="font-medium">Heater</h3>
                        <Switch
                          checked={roomData.heaterOn}
                          onCheckedChange={toggleHeater}
                        />
                      </div>
                    </Card>

                    <Card
                      className={`p-4 ${roomData.dryerOn ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : ""}`}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-full ${roomData.dryerOn ? "bg-blue-100 dark:bg-blue-900/30" : "bg-muted"}`}
                        >
                          <Droplets
                            className={`h-8 w-8 ${roomData.dryerOn ? "text-blue-500" : "text-muted-foreground"}`}
                          />
                        </motion.div>
                        <h3 className="font-medium">Dryer</h3>
                        <Switch
                          checked={roomData.dryerOn}
                          onCheckedChange={toggleDryer}
                        />
                      </div>
                    </Card>

                    <Card
                      className={`p-4 ${roomData.fanOn ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}`}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-full ${roomData.fanOn ? "bg-green-100 dark:bg-green-900/30" : "bg-muted"}`}
                        >
                          <Fan
                            className={`h-8 w-8 ${roomData.fanOn ? "text-green-500" : "text-muted-foreground"}`}
                          />
                        </motion.div>
                        <h3 className="font-medium">Fan</h3>
                        <Switch
                          checked={roomData.fanOn}
                          onCheckedChange={toggleFan}
                        />
                      </div>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={emergencyStop}
                  >
                    Emergency Stop
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="automatic" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Automatic Drying Control</CardTitle>
                  <CardDescription>
                    Configure and start automatic drying program
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetTemp">
                          Target Temperature (°C)
                        </Label>
                        <Input
                          id="targetTemp"
                          type="number"
                          value={roomData.targetTemperature}
                          onChange={handleTargetTempChange}
                          min={0}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetHumidity">
                          Target Humidity (%)
                        </Label>
                        <Input
                          id="targetHumidity"
                          type="number"
                          value={roomData.targetHumidity}
                          onChange={handleTargetHumidityChange}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dryingTime">Drying Time (minutes)</Label>
                      <Input
                        id="dryingTime"
                        type="number"
                        value={roomData.dryingTimeMinutes}
                        onChange={handleDryingTimeChange}
                        min={1}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={saveSettings}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button
                    className="w-full"
                    onClick={startDrying}
                    disabled={roomData.dryingInProgress}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Automatic Drying
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
