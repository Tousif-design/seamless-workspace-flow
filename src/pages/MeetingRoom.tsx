
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Users,
  MonitorUp,
  Settings,
  MoreVertical,
} from "lucide-react";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const handleEndCall = () => {
    navigate("/meet");
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Main content area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Video tiles */}
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div
              key={id}
              className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-2xl text-gray-400">U{id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? (
                <Mic className="h-5 w-5 text-white" />
              ) : (
                <MicOff className="h-5 w-5 text-red-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? (
                <Video className="h-5 w-5 text-white" />
              ) : (
                <VideoOff className="h-5 w-5 text-red-500" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
            >
              <MonitorUp className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
            >
              <MessageSquare className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
            >
              <Users className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
            >
              <Settings className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5 text-white" />
            </Button>
          </div>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
