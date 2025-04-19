import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";

interface Room {
  id: number;
  name: string;
  isConnected: boolean;
  temperature: number;
  humidity: number;
  heaterOn: boolean;
  dryerOn: boolean;
  fanOn: boolean;
  dryingInProgress: boolean;
  timeRemaining: number; // in seconds
}

interface RoomCardProps {
  room: Room;
  onToggleDevice: (roomId: number, device: "heater" | "dryer" | "fan") => void;
  onEmergencyStop: (roomId: number) => void;
}

// Inline RoomCard component since there seems to be an issue with the import
const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onToggleDevice,
  onEmergencyStop,
}) => {
  const handleDeviceToggle = (
    e: React.MouseEvent,
    device: "heater" | "dryer" | "fan",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleDevice(room.id, device);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEmergencyStop(room.id);
  };

  return (
    <Card className="h-full bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{room.name}</h2>
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${room.isConnected ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="text-sm">
              {room.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {room.isConnected ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Temperature</div>
                <div className="text-2xl font-semibold">
                  {room.temperature}°C
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (room.temperature / 40) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Humidity</div>
                <div className="text-2xl font-semibold">{room.humidity}%</div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${room.humidity}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <button
                onClick={(e) => handleDeviceToggle(e, "heater")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  room.heaterOn
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Heater {room.heaterOn ? "ON" : "OFF"}
              </button>
              <button
                onClick={(e) => handleDeviceToggle(e, "dryer")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  room.dryerOn
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Dryer {room.dryerOn ? "ON" : "OFF"}
              </button>
              <button
                onClick={(e) => handleDeviceToggle(e, "fan")}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  room.fanOn
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Fan {room.fanOn ? "ON" : "OFF"}
              </button>
            </div>

            {room.dryingInProgress && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">
                  Drying in progress
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div
                      className="bg-purple-500 h-3 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {Math.floor(room.timeRemaining / 3600)}h{" "}
                    {Math.floor((room.timeRemaining % 3600) / 60)}m
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleStop}
              className="w-full py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              EMERGENCY STOP
            </button>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>Device disconnected</p>
            <p className="text-sm mt-2">Check connection and try again</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Home = () => {
  // Mock data for the rooms - in a real app this would come from an API or WebSocket
  const [rooms, setRooms] = React.useState<Room[]>([
    {
      id: 1,
      name: "Room 1",
      isConnected: true,
      temperature: 25.5,
      humidity: 65,
      heaterOn: false,
      dryerOn: true,
      fanOn: false,
      dryingInProgress: true,
      timeRemaining: 3600, // 1 hour
    },
    {
      id: 2,
      name: "Room 2",
      isConnected: true,
      temperature: 22.0,
      humidity: 45,
      heaterOn: true,
      dryerOn: false,
      fanOn: true,
      dryingInProgress: false,
      timeRemaining: 0,
    },
    {
      id: 3,
      name: "Room 3",
      isConnected: false,
      temperature: 0,
      humidity: 0,
      heaterOn: false,
      dryerOn: false,
      fanOn: false,
      dryingInProgress: false,
      timeRemaining: 0,
    },
  ]);

  // Function to handle toggling of devices
  const handleToggleDevice = (
    roomId: number,
    device: "heater" | "dryer" | "fan",
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          switch (device) {
            case "heater":
              return { ...room, heaterOn: !room.heaterOn };
            case "dryer":
              return { ...room, dryerOn: !room.dryerOn };
            case "fan":
              return { ...room, fanOn: !room.fanOn };
            default:
              return room;
          }
        }
        return room;
      }),
    );
  };

  // Function to handle emergency stop
  const handleEmergencyStop = (roomId: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            heaterOn: false,
            dryerOn: false,
            fanOn: false,
            dryingInProgress: false,
            timeRemaining: 0,
          };
        }
        return room;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Drying Room Control Panel
          </h1>
          <p className="text-gray-600">
            Monitor and control your drying environments
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link to={`/room/${room.id}`} key={room.id} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <RoomCard
                  room={room}
                  onToggleDevice={handleToggleDevice}
                  onEmergencyStop={handleEmergencyStop}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        <Card className="mt-8 bg-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">System Status</h2>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>System Online</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;
