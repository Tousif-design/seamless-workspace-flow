
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Video, Users, Monitor, MessageSquare, Calendar, Clock, Shield, Copy, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Meet = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [userName, setUserName] = useState("");
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("join");

  // Generate a random meeting code
  const generateMeetingCode = () => {
    const characters = 'abcdefghijkmnpqrstuvwxyz123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Upcoming meetings data
  const upcomingMeetings = [
    {
      id: "1",
      title: "Weekly Team Standup",
      time: "10:00 AM",
      date: "Today",
      participants: [
        { name: "Alex", image: "" },
        { name: "Jordan", image: "" },
        { name: "Taylor", image: "" },
        { name: "Casey", image: "" },
      ],
    },
    {
      id: "2",
      title: "Project Review",
      time: "2:00 PM",
      date: "Today",
      participants: [
        { name: "Morgan", image: "" },
        { name: "Riley", image: "" },
      ],
    },
    {
      id: "3",
      title: "Client Presentation",
      time: "11:30 AM",
      date: "Tomorrow",
      participants: [
        { name: "Sam", image: "" },
        { name: "Avery", image: "" },
        { name: "Client", image: "" },
      ],
    },
  ];

  // Recent meetings data
  const recentMeetings = [
    {
      id: "1",
      title: "Design Sync",
      date: "Yesterday",
      duration: "45m",
      participants: 4,
    },
    {
      id: "2",
      title: "Product Planning",
      date: "2 days ago",
      duration: "1h 15m",
      participants: 6,
    },
    {
      id: "3",
      title: "Interview: Developer Position",
      date: "3 days ago",
      duration: "50m",
      participants: 3,
    },
  ];

  const handleStartMeeting = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }
    
    const generatedCode = generateMeetingCode();
    navigate("/meet/room", { 
      state: { 
        code: generatedCode,
        userName: userName,
        isHost: true
      } 
    });
    toast.success("Meeting created successfully", {
      description: `Your meeting code is ${generatedCode}`,
      action: {
        label: "Copy",
        onClick: () => {
          navigator.clipboard.writeText(generatedCode);
          toast.success("Meeting code copied to clipboard");
        },
      },
    });
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
    
    navigate("/meet/room", { 
      state: { 
        code: meetingCode,
        userName: userName,
        isHost: false
      } 
    });
    toast.success(`Joined meeting: ${meetingCode}`);
  };

  const handleCopyMeetingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Meeting code copied to clipboard");
  };

  const handleJoinUpcomingMeeting = (meetingId: string, meetingTitle: string) => {
    if (!userName.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }
    
    navigate("/meet/room", { 
      state: { 
        code: meetingId,
        userName: userName,
        isHost: false,
        title: meetingTitle
      } 
    });
    toast.success(`Joined meeting: ${meetingTitle}`);
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
              <h1 className="text-3xl font-bold text-gray-900">Google Meet</h1>
              <p className="text-gray-600 mt-1">Secure video meetings for teams and businesses</p>
            </div>
            {!isCreatingMeeting ? (
              <Button 
                onClick={() => {
                  setIsCreatingMeeting(true);
                  setSelectedTab("new");
                }} 
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
            <div>
              <Card className="overflow-hidden">
                <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="join">Join a Meeting</TabsTrigger>
                    <TabsTrigger value="new">Create New Meeting</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="join" className="p-6 space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <video 
                        className="w-full h-full object-cover" 
                        poster="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold">Join a meeting</h3>
                          <p className="text-sm opacity-90">Enter a code to join instantly</p>
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
                  </TabsContent>
                  
                  <TabsContent value="new" className="p-6 space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                      <video 
                        className="w-full h-full object-cover" 
                        poster="https://images.unsplash.com/photo-1611162618758-2a29a995354b?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold">Start a new meeting</h3>
                          <p className="text-sm opacity-90">Invite others with the generated code</p>
                        </div>
                      </div>
                    </div>
                    
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
                      <Button 
                        onClick={handleStartMeeting} 
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Video className="mr-2 h-4 w-4" /> Create Meeting
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => (
                      <div 
                        key={meeting.id}
                        className="flex items-start p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="mr-3 bg-green-100 text-green-800 p-2 rounded-lg">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{meeting.time}, {meeting.date}</span>
                          </div>
                          <div className="flex items-center mt-2 space-x-1">
                            <div className="flex -space-x-2">
                              {meeting.participants.slice(0, 3).map((participant, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                  <AvatarFallback className="text-xs">
                                    {participant.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {meeting.participants.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-xs text-gray-600">+{meeting.participants.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleJoinUpcomingMeeting(meeting.id, meeting.title)}
                        >
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meeting Features</CardTitle>
                </CardHeader>
                <CardContent>
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
                      <div key={i} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="mr-3 text-green-600">{feature.icon}</div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentMeetings.map((meeting, i) => (
                      <div key={i} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="mr-3 bg-blue-100 text-blue-800 p-2 rounded-lg">
                          <Video className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">{meeting.date}</Badge>
                            <Badge variant="outline" className="text-xs">{meeting.duration}</Badge>
                            <Badge variant="outline" className="text-xs">{meeting.participants} participants</Badge>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meet;
