import { UserStats } from "@shared/schema";
import { ArrowUp } from "lucide-react";

interface YearlyProgressProps {
  messagesByMonth: Record<string, number>;
  stats: UserStats;
}

export default function YearlyProgress({ messagesByMonth, stats }: YearlyProgressProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Find the month with maximum messages
  const maxMonthMessages = Math.max(...Object.values(messagesByMonth));
  const maxMonthIndex = Object.entries(messagesByMonth).reduce(
    (maxIndex, [month, count]) => count > messagesByMonth[maxIndex[0]] ? [month, count] : maxIndex,
    ['0', 0]
  );
  
  // Mock year-over-year growth (for demo purposes)
  const messageDelta = 23;
  const voiceDelta = 45;
  const reactionsDelta = 18;
  const serversDelta = 40;

  return (
    <section className="py-16 px-6 section-fade">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          {stats.year === 0 ? "Your All-Time Progress" : "Your Year in Progress"}
        </h2>
        
        <div className="bg-discord-dark rounded-xl p-6 md:p-8 shadow-xl mb-12">
          <h3 className="text-xl font-bold mb-6">Monthly Activity</h3>
          
          <div className="chart-container mb-6">
            {/* Months */}
            <div className="flex justify-between mb-2">
              {months.map((month, index) => (
                <span key={index} className="text-xs text-gray-400">{month}</span>
              ))}
            </div>
            
            {/* Bars */}
            <div className="flex items-end h-48 space-x-2">
              {months.map((month, index) => {
                const height = maxMonthMessages > 0 
                  ? (messagesByMonth[index.toString()] / maxMonthMessages) * 100 
                  : 0;
                
                return (
                  <div 
                    key={index}
                    className={`flex-1 rounded-t-md transition-all duration-500 ease-out hover:opacity-100`}
                    style={{ 
                      height: `${height}%`, 
                      backgroundColor: index.toString() === maxMonthIndex[0] 
                        ? 'rgb(88, 101, 242)' 
                        : `rgba(88, 101, 242, ${0.3 + (height / 200)})`
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center text-gray-300">
            <p>
              Your most active month: 
              <span className="font-semibold text-white"> {months[Number(maxMonthIndex[0])]}</span> with 
              <span className="font-semibold text-white"> {maxMonthIndex[1].toLocaleString()} messages</span>
            </p>
          </div>
        </div>
        
        <div className="bg-discord-dark rounded-xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6">
            {stats.year === 0 ? "All-Time Statistics" : "Year-over-Year Growth"}
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="text-center">
              <div className="text-gray-400 mb-2">Total Messages</div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">{stats.totalMessages.toLocaleString()}</div>
              <div className="text-sm text-green-400 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                {stats.year === 0 ? "Total all-time messages" : `${messageDelta}% from last year`}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-400 mb-2">Voice Minutes</div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">{stats.totalVoiceMinutes.toLocaleString()}</div>
              <div className="text-sm text-green-400 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                {stats.year === 0 ? "Total voice chat minutes" : `${voiceDelta}% from last year`}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-400 mb-2">Reactions Given</div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">{stats.totalReactions.toLocaleString()}</div>
              <div className="text-sm text-green-400 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                {stats.year === 0 ? "Total reactions sent" : `${reactionsDelta}% from last year`}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-gray-400 mb-2">Servers Joined</div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">{Array.isArray(stats.topServers) ? stats.topServers.length : 0}</div>
              <div className="text-sm text-green-400 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                {serversDelta}% from last year
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
