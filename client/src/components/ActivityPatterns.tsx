import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityPatternsProps {
  heatmap: number[][];
}

export default function ActivityPatterns({ heatmap }: ActivityPatternsProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Find max value for opacity calculation
  const maxValue = Math.max(...heatmap.flatMap(row => row));
  
  // Find peak activity
  let peakDay = 0;
  let peakHour = 0;
  let peakValue = 0;
  
  heatmap.forEach((dayRow, dayIndex) => {
    dayRow.forEach((value, hourIndex) => {
      if (value > peakValue) {
        peakValue = value;
        peakDay = dayIndex;
        peakHour = hourIndex;
      }
    });
  });
  
  // Format peak time for display
  const formatHour = (hour: number) => {
    return hour === 0 ? '12 AM' : 
           hour < 12 ? `${hour} AM` : 
           hour === 12 ? '12 PM' : 
           `${hour - 12} PM`;
  };
  
  const peakTimeStart = formatHour(peakHour);
  const peakTimeEnd = formatHour((peakHour + 3) % 24); // Assume 3-hour window for peak
  const peakDayName = days[peakDay];

  return (
    <section className="py-16 px-6 bg-discord-darker relative overflow-hidden section-fade">
      <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/5 opacity-50"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Your Activity Patterns</h2>
        
        {/* Message Heatmap */}
        <div className="bg-discord-dark rounded-xl p-6 md:p-8 mb-12 shadow-xl">
          <h3 className="text-xl font-bold mb-6">When You're Most Active</h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {/* Day labels */}
            {days.map((day, index) => (
              <div key={index} className="text-center text-xs text-gray-400">{day}</div>
            ))}
          </div>
          
          {/* Actual heatmap */}
          <div className="grid grid-cols-7 gap-2 mb-8">
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="flex flex-col gap-2">
                {hours.map((hour, hourIndex) => {
                  // Display only 6 hour blocks for simplicity (every 4 hours)
                  if (hourIndex % 4 !== 0) return null;
                  
                  const value = heatmap[dayIndex][hourIndex];
                  const opacity = value / maxValue;
                  
                  return (
                    <TooltipProvider key={hourIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="message-dot h-8 w-full rounded hover:bg-indigo-600/60 cursor-pointer"
                            style={{ 
                              backgroundColor: `rgba(88, 101, 242, ${opacity})`,
                              opacity: opacity > 0 ? 1 : 0.2
                            }}
                          ></div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-discord-dark border-discord-darkest text-white">
                          <div className="text-xs">
                            {day} at {formatHour(hourIndex)}: {value} messages
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center mb-2">
            <div className="flex items-center space-x-2">
              <span className="block w-4 h-4 rounded bg-indigo-600/20"></span>
              <span className="text-xs text-gray-400">Less Active</span>
            </div>
            <div className="w-24"></div>
            <div className="flex items-center space-x-2">
              <span className="block w-4 h-4 rounded bg-indigo-600"></span>
              <span className="text-xs text-gray-400">Most Active</span>
            </div>
          </div>
          
          <div className="text-center mt-4 text-gray-300">
            <p>Your peak activity: <span className="font-semibold text-white">{peakDayName} ({peakTimeStart}-{peakTimeEnd})</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
