'use client';

import { useEffect, useState } from 'react';
import { format, isSameDay, isSameMonth, setMonth, setYear, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { mockExpenses } from '@/lib/data';
import { Expense } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [events, setEvents] = useState<Expense[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Get formatted month name
  const monthName = format(currentMonth, 'MMMM yyyy');
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = setMonth(prev, prev.getMonth() - 1);
      setDate(newDate);
      return newDate;
    });
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = setMonth(prev, prev.getMonth() + 1);
      setDate(newDate);
      return newDate;
    });
  };
  
  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setDate(today);
  };
  
  // Initialize events from mock data
  useEffect(() => {
    const recurring = mockExpenses.filter(
      (expense) => expense.active && expense.type === 'recurring' && expense.nextRenewal
    );
    setEvents(recurring);
  }, []);
  
  // Function to determine which days have events
  const getDayWithEvents = (day: Date) => {
    return events.some((event) => 
      event.nextRenewal && isSameDay(new Date(event.nextRenewal), day)
    );
  };
  
  // Get events for selected date
  const eventsForDate = events.filter(
    (event) => event.nextRenewal && isSameDay(new Date(event.nextRenewal), date)
  );
  
  // Get all events for the current month in list view
  const eventsForMonth = events
    .filter((event) => 
      event.nextRenewal && 
      isSameMonth(new Date(event.nextRenewal), currentMonth)
    )
    .sort((a, b) => 
      (a.nextRenewal as Date).getTime() - (b.nextRenewal as Date).getTime()
    );
  
  // Get events by future months for upcoming view
  const getUpcomingEvents = () => {
    const now = new Date();
    const futureMonths: { month: string; events: Expense[] }[] = [];
    
    // Generate the next 6 months
    for (let i = 0; i < 6; i++) {
      const targetMonth = addDays(now, i * 30);
      const monthLabel = format(targetMonth, 'MMMM yyyy');
      
      const monthEvents = events.filter((event) => 
        event.nextRenewal && 
        isSameMonth(new Date(event.nextRenewal), targetMonth)
      ).sort((a, b) => 
        (a.nextRenewal as Date).getTime() - (b.nextRenewal as Date).getTime()
      );
      
      if (monthEvents.length > 0) {
        futureMonths.push({
          month: monthLabel,
          events: monthEvents,
        });
      }
    }
    
    return futureMonths;
  };
  
  const upcomingEvents = getUpcomingEvents();

  // Get all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Calculate total renewals for the month
  const totalRenewals = eventsForMonth.reduce((sum, event) => sum + event.amount, 0);
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Renewal Calendar</h1>
        <p className="text-muted-foreground">
          Track your upcoming subscription renewals
        </p>
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium">{monthName}</h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <Select value={view} onValueChange={(value: 'month' | 'list') => setView(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month View</SelectItem>
            <SelectItem value="list">List View</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {view === 'month' ? (
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                {eventsForMonth.length} renewals this month · Total: ${totalRenewals.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="mx-auto max-w-md rounded-md border"
                modifiers={{
                  event: (day) => getDayWithEvents(day),
                }}
                modifiersClassNames={{
                  event: "relative before:absolute before:top-0 before:right-0 before:h-2 before:w-2 before:rounded-full before:bg-primary",
                }}
                components={{
                  DayContent: (props) => (
                    props.date ? (
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full p-0 text-sm hover:bg-muted">
                        {props.date.getDate()}
                        {getDayWithEvents(props.date) && (
                          <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                        )}
                      </div>
                    ) : null
                  ),
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {format(date, 'MMMM d, yyyy')}
                </div>
              </CardTitle>
              <CardDescription>
                {eventsForDate.length === 0
                  ? 'No renewals on this date'
                  : `${eventsForDate.length} renewal${eventsForDate.length > 1 ? 's' : ''} · $${eventsForDate.reduce((sum, event) => sum + event.amount, 0).toFixed(2)} total`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsForDate.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground">
                    Select a day with renewals to view details
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForDate.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.name}</span>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {event.description}
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>Amount:</span>
                        <span className="font-medium">
                          {event.currency} {event.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>This Month's Renewals</CardTitle>
              <CardDescription>
                {monthName} · {eventsForMonth.length} renewal{eventsForMonth.length !== 1 ? 's' : ''} · ${totalRenewals.toFixed(2)} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsForMonth.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground">
                    No renewals for this month
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsForMonth.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {event.nextRenewal && format(new Date(event.nextRenewal), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {event.currency} {event.amount.toFixed(2)}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Renewals</CardTitle>
              <CardDescription>
                Next 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-4">
                  <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming renewals found
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map((month) => (
                    <div key={month.month}>
                      <h3 className="mb-2 font-medium">{month.month}</h3>
                      <div className="space-y-2">
                        {month.events.map((event) => (
                          <div
                            key={`${month.month}-${event.id}`}
                            className="flex items-center justify-between rounded-md border p-2 text-sm transition-colors hover:bg-muted/50"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{event.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {event.nextRenewal && format(new Date(event.nextRenewal), 'MMM d')}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {event.currency} {event.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}