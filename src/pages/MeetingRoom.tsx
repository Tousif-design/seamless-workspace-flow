
import React, { useState, useEffect } from "react";
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
  MoreVertical,
  Settings,
  Hand,
  PanelRight,
  PanelRightClose,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [participantCount, setParticipantCount] = useState(6);
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "John Doe", text: "Hello everyone!", time: "10:01 AM" },
    { sender: "Jane Smith", text: "Hi John, glad you could join us.", time: "10:02 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulate joining notification
    toast.success("You joined the meeting");
    
    // Simulate participant joining
    const timer = setTimeout(() => {
      setParticipantCount((prev) => prev + 1);
      toast.info("Sophia Miller joined the meeting");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEndCall = () => {
    toast.info("Meeting ended");
    navigate("/meet");
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast(isVideoOn ? "Camera turned off" : "Camera turned on");
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast(isAudioOn ? "Microphone muted" : "Microphone unmuted");
  };

  const toggleHand = () => {
    setIsHandRaised(!isHandRaised);
    toast(isHandRaised ? "Hand lowered" : "Hand raised");
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast(isScreenSharing ? "Stopped sharing screen" : "Sharing your screen");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsParticipantsOpen(false);
  };

  const toggleParticipants = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
    setIsChatOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { sender: "You", text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      setNewMessage("");
    }
  };

  const participants = [
    { id: 1, name: "You", isSpeaking: false, isHost: true },
    { id: 2, name: "Alex Johnson", isSpeaking: true, isHost: false },
    { id: 3, name: "Maria Garcia", isSpeaking: false, isHost: false },
    { id: 4, name: "David Lee", isSpeaking: false, isHost: false },
    { id: 5, name: "Sarah Williams", isSpeaking: false, isHost: false },
    { id: 6, name: "Robert Brown", isSpeaking: false, isHost: false },
    { id: 7, name: "Sophia Miller", isSpeaking: false, isHost: false },
  ].slice(0, participantCount);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="font-semibold">Team Meeting</h2>
          <div className="ml-4 px-2 py-1 bg-gray-700 rounded text-xs">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => toast.info("Meeting details copied to clipboard")}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full ${isScreenSharing ? 'lg:grid-cols-2' : ''}`}>
            {/* Video tiles */}
            {isScreenSharing && (
              <div className="col-span-full lg:col-span-2 bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
                <div className="text-white text-center">
                  <MonitorUp className="h-12 w-12 mx-auto mb-2" />
                  <p>You are sharing your screen</p>
                </div>
              </div>
            )}
            
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`bg-gray-800 rounded-lg aspect-video flex items-center justify-center relative ${
                  participant.isSpeaking ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {participant.id === 1 && !isVideoOn ? (
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-2xl text-white">Y</span>
                  </div>
                ) : (
                  <img 
                    src={`https://randomuser.me/api/portraits/${participant.id % 2 === 0 ? 'women' : 'men'}/${participant.id}.jpg`} 
                    alt={participant.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs flex items-center">
                  {participant.name}
                  {participant.isHost && <span className="ml-1 text-xs">(Host)</span>}
                  {participant.isSpeaking && <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>}
                </div>
                {participant.id === 1 && (
                  <div className="absolute top-2 right-2 space-x-1">
                    {!isAudioOn && <MicOff className="h-4 w-4 text-red-500 bg-black bg-opacity-50 p-0.5 rounded" />}
                    {!isVideoOn && <VideoOff className="h-4 w-4 text-red-500 bg-black bg-opacity-50 p-0.5 rounded" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        {(isChatOpen || isParticipantsOpen) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-white">
                {isChatOpen ? "Chat" : "Participants"}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                }}
              >
                <PanelRightClose className="h-5 w-5" />
              </Button>
            </div>
            
            {isChatOpen && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"}`}>
                      <div className="flex items-center text-xs text-gray-400 mb-1">
                        <span>{msg.sender}</span>
                        <span className="ml-2">{msg.time}</span>
                      </div>
                      <div className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        msg.sender === "You" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-700 text-white"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white rounded-l-md px-4 py-2 focus:outline-none"
                  />
                  <Button type="submit" className="rounded-l-none">Send</Button>
                </form>
              </>
            )}
            
            {isParticipantsOpen && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4 pb-2 border-b border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-2">In the meeting ({participants.length})</h4>
                  <div className="space-y-3">
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                            <span className="text-sm text-white">{p.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-white text-sm">{p.name}</p>
                            {p.isHost && <span className="text-xs text-gray-400">Host</span>}
                          </div>
                        </div>
                        {p.isSpeaking && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${!isAudioOn ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-700'}`}
              onClick={toggleAudio}
            >
              {isAudioOn ? (
                <Mic className="h-5 w-5 text-white" />
              ) : (
                <MicOff className="h-5 w-5 text-white" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-700'}`}
              onClick={toggleVideo}
            >
              {isVideoOn ? (
                <Video className="h-5 w-5 text-white" />
              ) : (
                <VideoOff className="h-5 w-5 text-white" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-gray-700'}`}
              onClick={toggleHand}
            >
              <Hand className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isScreenSharing ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-gray-700'}`}
              onClick={toggleScreenShare}
            >
              <MonitorUp className="h-5 w-5 text-white" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isChatOpen ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={toggleChat}
            >
              <MessageSquare className="h-5 w-5 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isParticipantsOpen ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={toggleParticipants}
            >
              <Users className="h-5 w-5 text-white" />
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
