import { UserStats } from "@shared/schema";
import { ArrowUp } from "lucide-react";

interface StatsHighlightsProps {
  stats: UserStats;
}

export default function StatsHighlights({ stats }: StatsHighlightsProps) {
  // Calculate daily average
  const daysInYear = 365;
  const dailyAverage = Math.round(stats.totalMessages / daysInYear);
  
  // Convert voice minutes to days
  const voiceDays = Math.floor(stats.totalVoiceMinutes / (60 * 24));
  
  // For demo purposes, show percentage increases
  const messageIncrease = 23;
  const voiceIncrease = 45;
  const reactionsIncrease = 18;

  return (
    <section className="py-16 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Your Discord Highlights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Messages Sent Card */}
          <div className="stats-card rounded-xl p-6 relative overflow-hidden shadow-lg section-fade" style={{background: "linear-gradient(135deg, #5865F2 0%, #7289DA 100%)"}}>
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-lg font-medium text-white/80 mb-1">Total Messages</div>
              <div className="text-5xl font-bold mb-4">{stats.totalMessages.toLocaleString()}</div>
              <div className="text-white/80">
                That's <span className="text-white font-semibold">{dailyAverage} messages</span> per day on average!
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center">
                <ArrowUp className="text-green-300 mr-2 h-4 w-4" />
                <span className="text-green-300 font-medium">{messageIncrease}% increase</span>
                <span className="text-white/60 ml-2">from last year</span>
              </div>
            </div>
          </div>
          
          {/* Voice Chat Card */}
          <div className="stats-card rounded-xl p-6 relative overflow-hidden shadow-lg section-fade" style={{background: "linear-gradient(135deg, #5865F2 0%, #EB459E 100%)"}}>
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-lg font-medium text-white/80 mb-1">Voice Chat Time</div>
              <div className="text-5xl font-bold mb-4">{stats.totalVoiceMinutes} mins</div>
              <div className="text-white/80">
                That's over <span className="text-white font-semibold">{voiceDays} days</span> of talking!
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center">
                <ArrowUp className="text-green-300 mr-2 h-4 w-4" />
                <span className="text-green-300 font-medium">{voiceIncrease}% increase</span>
                <span className="text-white/60 ml-2">from last year</span>
              </div>
            </div>
          </div>
          
          {/* Reactions Card */}
          <div className="stats-card rounded-xl p-6 relative overflow-hidden shadow-lg section-fade" style={{background: "linear-gradient(135deg, #57F287 0%, #5865F2 100%)"}}>
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="text-lg font-medium text-white/80 mb-1">Reactions Given</div>
              <div className="text-5xl font-bold mb-4">{stats.totalReactions.toLocaleString()}</div>
              <div className="text-white/80">
                Your favorite: <span className="text-white font-semibold">👍 (768 times)</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center">
                <ArrowUp className="text-green-300 mr-2 h-4 w-4" />
                <span className="text-green-300 font-medium">{reactionsIncrease}% increase</span>
                <span className="text-white/60 ml-2">from last year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
