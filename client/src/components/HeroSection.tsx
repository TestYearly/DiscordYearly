import { User, UserStats } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { Share2, Download } from "lucide-react";

interface HeroSectionProps {
  user: User;
  stats: UserStats;
}

export default function HeroSection({ user, stats }: HeroSectionProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // In a real implementation, this would generate and download a report
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const handleShare = () => {
    // In a real implementation, this would open sharing options
  };

  return (
    <section className="py-12 md:py-20 px-6 bg-discord-darker relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/20 to-transparent opacity-70"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Your Year in Discord</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 animate-slide-up">
            Discover your chatting habits, favorite channels, and more from your 2023 Discord activity.
          </p>
          
          {/* User Profile Summary */}
          <div className="bg-discord-dark/70 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8">
              <div className="mb-6 md:mb-0">
                <div className="relative">
                  {user.discordAvatar ? (
                    <img 
                      src={user.discordAvatar} 
                      alt="User avatar" 
                      className="w-24 h-24 rounded-full border-4 border-indigo-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500 bg-indigo-700 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {(user.discordUsername || user.username).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-green-500 border-2 border-discord-dark"></div>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{user.discordUsername || user.username}</h2>
                <p className="text-gray-400 mb-4">
                  Joined{" "}
                  <span className="text-indigo-400">
                    {user.discordJoinedAt 
                      ? format(new Date(user.discordJoinedAt), "MMM yyyy") + " (" + Math.floor((new Date().getTime() - new Date(user.discordJoinedAt).getTime()) / (1000 * 60 * 60 * 24 * 365)) + " years ago)"
                      : "Unknown date"}
                  </span>
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 16H6a1 1 0 01-1-1V6a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1z" />
                      <path d="M12 11h3a1 1 0 000-2h-3V6a1 1 0 00-2 0v3H7a1 1 0 000 2h3v3a1 1 0 002 0v-3z" />
                    </svg>
                    {stats.topServers.length} Servers
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 16a4 4 0 110-8 4 4 0 010 8zm0 2a6 6 0 100-12 6 6 0 000 12z" />
                      <path d="M16 6a4 4 0 110 8 1 1 0 120 2 6 6 0 000-12 1 1 0 10-2 0v2z" />
                    </svg>
                    {stats.totalVoiceMinutes} Hours in Voice
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
                      <path d="M4 8h16v1H4zm0 3h10v1H4zm0 3h10v1H4zm0 3h10v1H4z" />
                    </svg>
                    {stats.totalMessages.toLocaleString()} Messages
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Button
              variant="default"
              size="lg"
              onClick={handleDownload}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 py-6 font-medium"
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download Report
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="bg-discord-dark border border-indigo-500 hover:bg-indigo-600/10 rounded-full px-6 py-6 font-medium"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Your Wrapped
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
