
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();

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
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 h-[500px]">
                {/* Calendar Grid Placeholder */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border rounded-lg p-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Upcoming Meetings
                </h3>
                <div className="space-y-3">
                  {[
                    { time: "10:00 AM", title: "Team Standup" },
                    { time: "2:00 PM", title: "Project Review" },
                    { time: "4:30 PM", title: "Client Meeting" },
                  ].map((meeting, i) => (
                    <div
                      key={i}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <CalendarIcon className="h-4 w-4 mr-3 text-blue-500" />
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-gray-500">{meeting.time}</p>
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

export default Calendar;
