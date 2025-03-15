
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, Plus, Users, Clock, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Event type definition
type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
};

const Calendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Standup",
      date: "2023-06-07",
      time: "10:00",
      duration: "30m",
      attendees: ["Alex", "Jordan", "Casey"],
    },
    {
      id: "2",
      title: "Project Review",
      date: "2023-06-07",
      time: "14:00",
      duration: "1h",
      attendees: ["Alex", "Sam", "Taylor"],
    },
    {
      id: "3",
      title: "Client Meeting",
      date: "2023-06-07",
      time: "16:30",
      duration: "45m",
      attendees: ["Alex", "Client"],
    },
  ]);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: today.toISOString().split('T')[0],
    time: "09:00",
    duration: "30m",
    attendees: "",
  });
  
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  
  // Get the number of days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days for the current view
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      toast.error("Event title cannot be empty");
      return;
    }
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      duration: newEvent.duration,
      attendees: newEvent.attendees.split(',').map(a => a.trim()).filter(Boolean),
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      date: today.toISOString().split('T')[0],
      time: "09:00",
      duration: "30m",
      attendees: "",
    });
    setShowNewEventDialog(false);
    toast.success("Event added successfully");
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // You could also filter events for this date here
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const hasEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.some(event => event.date === dateStr);
  };
  
  const getEventsForSelectedDate = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr)
                 .sort((a, b) => a.time.localeCompare(b.time));
  };
  
  const handleStartMeet = (eventTitle: string) => {
    navigate("/meet");
    toast.success(`Starting meeting for "${eventTitle}"`);
  };
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

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
            <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      placeholder="Event title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select 
                        value={newEvent.duration}
                        onValueChange={(value) => setNewEvent({...newEvent, duration: value})}
                      >
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15m">15 minutes</SelectItem>
                          <SelectItem value="30m">30 minutes</SelectItem>
                          <SelectItem value="45m">45 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="1h30m">1.5 hours</SelectItem>
                          <SelectItem value="2h">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="attendees">Attendees</Label>
                    <Input
                      id="attendees"
                      value={newEvent.attendees}
                      onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                      placeholder="Comma-separated list of attendees"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>
                    Create Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">
                    {monthNames[currentMonth]} {currentYear}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day, i) => (
                      <div key={i} className="text-center text-sm font-medium text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, i) => (
                      <div
                        key={i}
                        className={`aspect-square border rounded-lg p-1 flex flex-col items-center ${
                          day ? 'cursor-pointer hover:bg-blue-50 transition-colors' : ''
                        } ${
                          day && isToday(day) ? 'bg-blue-100 border-blue-300' : ''
                        } ${
                          day && selectedDate && day.getDate() === selectedDate.getDate() &&
                          day.getMonth() === selectedDate.getMonth() ? 
                          'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => day && handleDateClick(day)}
                      >
                        {day && (
                          <>
                            <span className={`text-sm mt-1 ${isToday(day) ? 'font-bold' : ''}`}>
                              {day.getDate()}
                            </span>
                            {hasEvents(day) && (
                              <div className="mt-auto mb-1">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getEventsForSelectedDate().length > 0 ? (
                      getEventsForSelectedDate().map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start p-3 rounded-lg hover:bg-gray-50 border transition-colors"
                        >
                          <div className="min-w-[60px] text-sm text-gray-600">
                            {event.time}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{event.duration}</span>
                              {event.attendees.length > 0 && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{event.attendees.length} attendees</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-2"
                            onClick={() => handleStartMeet(event.title)}
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No events scheduled for this day
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.slice(0, 3).map((meeting, i) => (
                      <div
                        key={i}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <CalendarIcon className="h-4 w-4 mr-3 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(meeting.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} at {meeting.time}
                          </p>
                        </div>
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

export default Calendar;
