
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Video, Users, Monitor, MessageSquare, Calendar, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Meet = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [userName, setUserName] = useState("");
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

  const handleStartMeeting = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }
    
    navigate("/meet/room");
    toast.success("Meeting created successfully");
  };

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) {
      toast.error("Please enter a meeting code");
      return;
    }
    
    if (!userName.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }
    
    navigate("/meet/room");
    toast.success(`Joined meeting: ${meetingCode}`);
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

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Meetings</h1>
              <p className="text-gray-600 mt-1">Secure video meetings for teams and businesses</p>
            </div>
            {!isCreatingMeeting ? (
              <Button 
                onClick={() => setIsCreatingMeeting(true)} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Video className="mr-2 h-4 w-4" /> Start Meeting
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingMeeting(false)}
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {isCreatingMeeting ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Start a new meeting</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button onClick={handleStartMeeting} className="bg-green-600 hover:bg-green-700">
                        <Video className="mr-2 h-4 w-4" /> Start Now
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingMeeting(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <Video className="h-12 w-12 text-gray-400" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50 flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-semibold">Join a meeting</h3>
                        <p className="text-sm opacity-80">Enter a code or link to join instantly</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Code</label>
                      <input
                        type="text"
                        value={meetingCode}
                        onChange={(e) => setMeetingCode(e.target.value)}
                        placeholder="Enter meeting code"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <Button 
                      onClick={handleJoinMeeting}
                      disabled={!meetingCode.trim()}
                      className="w-full"
                    >
                      Join Meeting
                    </Button>
                  </div>
                </div>
              )}
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
                    {
                      icon: <Calendar className="h-5 w-5" />,
                      title: "Calendar integration",
                      description: "Schedule and manage meetings easily",
                    },
                    {
                      icon: <Clock className="h-5 w-5" />,
                      title: "No time limits",
                      description: "Host meetings for as long as needed",
                    },
                    {
                      icon: <Shield className="h-5 w-5" />,
                      title: "Secure meetings",
                      description: "End-to-end encryption for all meetings",
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
