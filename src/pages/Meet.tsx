
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Video, Users, Monitor, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Meet = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const handleStartMeeting = () => {
    navigate("/meet/room");
  };

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      navigate("/meet/room");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Google Meet</h1>
            <Button onClick={handleStartMeeting} className="bg-green-600 hover:bg-green-700">
              <Video className="mr-2 h-4 w-4" /> Start Meeting
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">Quick Join</h3>
              <p className="text-gray-600 mb-4">Enter a code or link to join the meeting</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  placeholder="Enter meeting code"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <Button onClick={handleJoinMeeting}>Join</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Meeting Features</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Users className="h-5 w-5" />,
                      title: "Host up to 250 participants",
                      description: "Connect with large teams seamlessly",
                    },
                    {
                      icon: <Monitor className="h-5 w-5" />,
                      title: "Screen sharing",
                      description: "Share your screen with participants",
                    },
                    {
                      icon: <MessageSquare className="h-5 w-5" />,
                      title: "Chat & Q&A",
                      description: "Interactive chat during meetings",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                      <div className="mr-3 text-green-600">{feature.icon}</div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meet;
