"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  User,
  Package,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import type { AttireRequest } from "@/types/students";
import { subDays, addDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface AttireRequestWithStudentAndAttire extends AttireRequest {
  students: {
    first_name: string;
    last_name: string;
    student_id: string;
  };
  attires: {
    name: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  student: string;
  studentId: string;
  attireId: string;
  attireName: string;
  status: string;
}

export function AttireCalendar() {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [attireRequests, setAttireRequests] = useState<
    AttireRequestWithStudentAndAttire[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [bufferDaysMap, setBufferDaysMap] = useState<{ [id: string]: number }>({});
  const [calendarView, setCalendarView] = useState<'rental' | 'rental+buffer'>('rental');
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [studentFilter, setStudentFilter] = useState<string>("");
  const [attireFilter, setAttireFilter] = useState<string>("");

  // Fetch attire requests with student information
  const fetchAttireRequests = async () => {
    setLoading(true);
    try {
      // First fetch all students
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("*")
        .order("first_name", { ascending: true });

      if (studentsError) throw studentsError;

      // Then fetch attire requests with student and attire information, including buffer
      const { data: requestsData, error: requestsError } = await supabase
        .from("attire_requests")
        .select(
          `*,
        students (
          first_name,
          last_name,
          student_id
        ),
        attires (
          name
        ),
        buffer
      `
        )
        .order("use_start_date", { ascending: true });

      if (requestsError) throw requestsError;

      console.log('Raw database data:', {
        studentsData,
        requestsData: requestsData.map(req => ({
          id: req.id,
          student_name: `${req.students.first_name} ${req.students.last_name}`,
          start_date: req.use_start_date,
          end_date: req.use_end_date,
          attire_name: req.attires.name,
          buffer: req.buffer
        }))
      });

      setAllStudents(studentsData);
      setAttireRequests(requestsData as AttireRequestWithStudentAndAttire[]);

      // Convert to calendar events
      const events: CalendarEvent[] = requestsData.map((request) => {
        // Parse dates and create them at midnight in local timezone
        const startDate = new Date(request.use_start_date + 'T00:00:00');
        const endDate = new Date(request.use_end_date + 'T00:00:00');
        
        console.log('Creating calendar event:', {
          requestId: request.id,
          studentName: `${request.students.first_name} ${request.students.last_name}`,
          originalStartDate: request.use_start_date,
          originalEndDate: request.use_end_date,
          parsedStartDate: startDate.toISOString(),
          parsedEndDate: endDate.toISOString(),
          attireName: request.attires.name
        });
        
        return {
          id: request.id,
          title: `${request.students.first_name} ${request.students.last_name}`,
          start: startDate,
          end: endDate,
          student: `${request.students.first_name} ${request.students.last_name}`,
          studentId: request.students.student_id,
          attireId: request.attire_id,
          attireName: request.attires.name,
          status: request.status,
        };
      });

      setCalendarEvents(events);

      // 2. Initialize bufferDaysMap from DB
      const bufferMap: { [id: string]: number } = {};
      requestsData.forEach((request) => {
        bufferMap[request.id] = request.buffer ?? 7;
      });
      setBufferDaysMap(bufferMap);
    } catch (error: any) {
      toast("Error fetching data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttireRequests();
  }, []);

  // Add updateBuffer function
  const updateBuffer = async (requestId: string, buffer: number) => {
    const { error } = await supabase
      .from("attire_requests")
      .update({ buffer })
      .eq("id", requestId);
    if (error) {
      toast("Failed to update buffer");
    }
  };

  // Get calendar grid for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return calendarEvents.filter((event) => {
      // Create dates at midnight in local timezone to avoid timezone issues
      const eventStart = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
      const eventEnd = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate());
      const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      console.log('Date comparison:', {
        date: date.toISOString(),
        dateAtMidnight: dateAtMidnight.toISOString(),
        eventStart: eventStart.toISOString(),
        eventEnd: eventEnd.toISOString(),
        eventTitle: event.title,
        isInRange: dateAtMidnight >= eventStart && dateAtMidnight <= eventEnd
      });
      
      // Check if the date falls within the event range
      return dateAtMidnight >= eventStart && dateAtMidnight <= eventEnd;
    });
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "returned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper to determine if a day is a rental or buffer day for an event
  function getDayTypeForEvent(day: Date, event: CalendarEvent): 'rental' | 'buffer' | null {
    // Create dates at midnight in local timezone to avoid timezone issues
    const rentalStart = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
    const rentalEnd = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate());
    const bufferDays = Number(bufferDaysMap[event.id] ?? 7);
    const bufferStart = new Date(rentalEnd);
    bufferStart.setDate(bufferStart.getDate() + 1);
    const bufferEnd = new Date(rentalEnd);
    bufferEnd.setDate(bufferEnd.getDate() + bufferDays);
    
    // Create day at midnight in local timezone
    const dayAtMidnight = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    
    console.log('Day type calculation:', {
      day: day.toISOString(),
      dayAtMidnight: dayAtMidnight.toISOString(),
      eventTitle: event.title,
      rentalStart: rentalStart.toISOString(),
      rentalEnd: rentalEnd.toISOString(),
      bufferStart: bufferStart.toISOString(),
      bufferEnd: bufferEnd.toISOString(),
      bufferDays,
      isRental: dayAtMidnight >= rentalStart && dayAtMidnight <= rentalEnd,
      isBuffer: calendarView === 'rental+buffer' && dayAtMidnight >= bufferStart && dayAtMidnight <= bufferEnd
    });
    
    if (dayAtMidnight >= rentalStart && dayAtMidnight <= rentalEnd) return 'rental';
    if (calendarView === 'rental+buffer' && dayAtMidnight >= bufferStart && dayAtMidnight <= bufferEnd) return 'buffer';
    return null;
  }

  // Filter events for calendar based on selected filters
  const filteredCalendarEvents = calendarEvents.filter(event => {
    const statusMatch = !statusFilter || event.status === statusFilter;
    const studentMatch = !studentFilter || event.studentId === studentFilter;
    const attireMatch = !attireFilter || event.attireId === attireFilter;
    return statusMatch && studentMatch && attireMatch;
  });

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = getCalendarDays();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="space-y-8">
      {/* View Toggle Tabs */}
      <div className="flex justify-end mb-4">
        <Tabs value={calendarView} onValueChange={v => setCalendarView(v as 'rental' | 'rental+buffer')}>
          <TabsList>
            <TabsTrigger value="rental">Rental Only</TabsTrigger>
            <TabsTrigger value="rental+buffer">Rental + Buffer</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <Label>Status</Label>
          <Select value={statusFilter || undefined} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32" />
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Student</Label>
          <Select value={studentFilter} onValueChange={setStudentFilter}>
            <SelectTrigger className="w-40"  />
            <SelectContent>
              {allStudents.map(s => (
                <SelectItem key={s.student_id} value={s.student_id}>
                  {s.first_name} {s.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Attire</Label>
          <Select value={attireFilter} onValueChange={setAttireFilter}>
            <SelectTrigger className="w-40"  />
            <SelectContent>
              {[...new Set(attireRequests.map(r => r.attires.name))].map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-[#E51937]/10 to-[#E51937]/5 rounded-xl">
            <CalendarIcon className="h-8 w-8 text-[#E51937]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#E51937] to-[#E51937]/80 bg-clip-text text-transparent">
              Rental Request Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage rental requests
            </p>
          </div>
        </div>
        <Button 
          onClick={goToToday} 
          variant="outline" 
          size="lg" 
          className="gap-2 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
        >
          <CalendarIcon className="h-4 w-4" />
          Today
        </Button>
      </div>

      {/* Calendar Navigation */}
      <Card className="border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={previousMonth} 
                className="h-9 w-9 p-0 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextMonth} 
                className="h-9 w-9 p-0 hover:bg-[#E51937]/5 hover:text-[#E51937] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E51937] mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading calendar...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">

              {dayNames.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-medium text-muted-foreground border-b"
                >
                  {day}
                </div>
              ))}

              
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentMonth;
                const isToday = day.toDateString() === new Date().toDateString();
                // For each event, check if this day is rental or buffer
                const eventsForDay = filteredCalendarEvents.map(event => ({
                  event,
                  type: getDayTypeForEvent(day, event)
                })).filter(e => e.type);

                return (
                  <div
                    key={index}
                    className={`min-h-[140px] p-2 border border-border rounded-lg transition-all duration-200 ${
                      isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-900/50"
                    } ${isToday ? "ring-2 ring-[#E51937] shadow-sm" : "hover:shadow-sm"}`}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                      } ${isToday ? "text-[#E51937] font-bold" : ""}`}
                    >
                      {day.getDate()}
                    </div>

                    <div className="space-y-1.5">
                      {eventsForDay.slice(0, 3).map(({ event, type }) => (
                        <div
                          key={`${event.id}-${day.toISOString()}`}
                          className={`text-xs p-2 rounded-lg border hover:shadow-sm transition-all duration-200 ${
                            type === 'rental'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-orange-100 text-orange-800 border-orange-200'
                          }`}
                          title={`${event.student} - ${event.attireName} (${event.status}) [${type}]`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <User className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate font-medium">{event.student}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 mt-1">
                            <Package className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{event.attireName}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 mt-1 text-xs">
                            <span>{type === 'rental' ? 'Rental' : 'Buffer'}</span>
                          </div>
                        </div>
                      ))}

                      {eventsForDay.length > 3 && (
                        <div className="text-xs text-muted-foreground p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          +{eventsForDay.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent> 
      </Card> 

      {/* Legend */}
      <Card className="border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 border-b px-6 py-4">
          <CardTitle className="text-lg font-semibold">Status & Period Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-100 rounded-lg">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-400 border border-blue-600" />
              <span className="text-sm text-blue-800 font-semibold">Rental Period</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-100 rounded-lg">
              <span className="inline-block w-4 h-4 rounded-full bg-orange-400 border border-orange-600" />
              <span className="text-sm text-orange-800 font-semibold">Buffer Period</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-100 rounded-lg">
              <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
              <span className="text-sm text-muted-foreground">Request approved</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-100 rounded-lg">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
              <span className="text-sm text-muted-foreground">Awaiting approval</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-100 rounded-lg">
              <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
              <span className="text-sm text-muted-foreground">Request rejected</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-100 rounded-lg">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Returned</Badge>
              <span className="text-sm text-muted-foreground">Attire returned</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">All Students & Attire Requests</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {allStudents.map((student) => {
              const studentRequests = attireRequests.filter(
                (req) => req.student_id === student.id
              );

              return (
                <div 
                  key={student.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-[#E51937]/10 to-[#E51937]/5 rounded-lg">
                        <User className="h-4 w-4 text-[#E51937]" />
                      </div>
                      <div>
                        <span className="font-medium">
                          {student.first_name} {student.last_name}
                        </span>
                        <Badge variant="outline" className="ml-2">{student.student_id}</Badge>
                      </div>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </div>

                  {studentRequests.length > 0 ? (
                    <div className="space-y-2">
                      {studentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 rounded-lg p-3 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {request.attires.name}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="font-medium">Rental:</span>
                              <span>{request.use_start_date}</span>
                              <span>-</span>
                              <span>{request.use_end_date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 pl-6 border-l border-zinc-200 dark:border-zinc-700 mt-1">
                              <CalendarIcon className="h-3 w-3 opacity-70" />
                              <span>Buffer until</span>
                              <span className="font-mono">
                                {request.use_end_date
                                  ? new Date(new Date(request.use_end_date).getTime() + (Number(bufferDaysMap[request.id] ?? 7) * 24 * 60 * 60 * 1000)).toLocaleDateString()
                                  : "-"}
                              </span>
                              <Label htmlFor={`buffer-days-${request.id}`} className="ml-2">Buffer (days):</Label>
                              <Input
                                id={`buffer-days-${request.id}`}
                                type="number"
                                min={0}
                                value={bufferDaysMap[request.id] ?? 7}
                                onChange={async e => {
                                  const newBuffer = Number(e.target.value);
                                  setBufferDaysMap(map => ({ ...map, [request.id]: newBuffer }));
                                  await updateBuffer(request.id, newBuffer);
                                }}
                                className="w-16"
                              />
                              <span title="Buffer is the number of days after the rental ends." className="ml-1 text-xs text-zinc-400">🛈</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No attire requests
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}