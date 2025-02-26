
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Video,
  Users,
  Monitor,
  MessageSquare,
  Link2,
  Settings,
  Calendar,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Meet = () => {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Google Meet</h1>
              <p className="text-gray-600 mt-2">Secure video conferencing for your team</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Schedule
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Video className="mr-2 h-4 w-4" /> New Meeting
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg mb-6 flex items-center justify-center">
                  <Video className="h-16 w-16 text-white opacity-50" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Join a Meeting</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={meetingCode}
                      onChange={(e) => setMeetingCode(e.target.value)}
                      placeholder="Enter meeting code"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button className="bg-green-600 hover:bg-green-700 px-6">
                      Join
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Shield className="h-8 w-8 text-green-600" />,
                    title: "Enterprise-grade security",
                    description: "Advanced security features to protect your meetings",
                  },
                  {
                    icon: <Link2 className="h-8 w-8 text-green-600" />,
                    title: "Easy sharing",
                    description: "Share meeting links instantly with your team",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Meeting Features</h3>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      icon: <Users className="h-5 w-5" />,
                      title: "Up to 250 participants",
                      description: "Perfect for large teams and events",
                    },
                    {
                      icon: <Monitor className="h-5 w-5" />,
                      title: "Screen sharing",
                      description: "Share your work in real-time",
                    },
                    {
                      icon: <MessageSquare className="h-5 w-5" />,
                      title: "Chat & Q&A",
                      description: "Interactive communication tools",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
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
