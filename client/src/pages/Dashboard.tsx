import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsHighlights from "@/components/StatsHighlights";
import ActivityPatterns from "@/components/ActivityPatterns";
import TopChannelsAndServers from "@/components/TopChannelsAndServers";
import MessageAnalysis from "@/components/MessageAnalysis";
import YearlyProgress from "@/components/YearlyProgress";
import ShareSection from "@/components/ShareSection";
import Footer from "@/components/Footer";
import { User, UserStats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define necessary interfaces for the components to avoid type issues
interface Server {
  id: number;
  name: string;
  icon: string;
  messageCount: number;
}

interface Channel {
  id: number;
  name: string;
  serverName: string;
  messageCount: number;
  percentage: number;
}

interface MessageTypes {
  text: number;
  media: number;
  links: number;
  code: number;
}

interface WordCount {
  word: string;
  count: number;
}

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const userId = params.get("id");
  const currentYear = new Date().getFullYear();
  const [selectedPeriod, setSelectedPeriod] = useState(`${currentYear}`);
  
  // Calculate year based on the selected period
  const year = selectedPeriod === 'all-time' ? undefined : parseInt(selectedPeriod);
  
  // Available years for selection - we'll show current year, previous years, and all-time
  const availableYears = [
    { id: `${currentYear}`, label: `${currentYear} (This Year)` },
    { id: `${currentYear - 1}`, label: `${currentYear - 1}` },
    { id: `${currentYear - 2}`, label: `${currentYear - 2}` },
    { id: 'all-time', label: 'All Time' }
  ];
  
  // If no userId is provided, redirect to home
  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  // Fetch user stats with period support
  const { data: stats, isLoading: isLoadingStats } = useQuery<UserStats>({
    queryKey: [`/api/stats/${userId}`, selectedPeriod],
    enabled: !!userId,
    queryFn: async () => {
      const url = `/api/stats/${userId}${year ? `?year=${year}` : '?allTime=true'}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    }
  });

  if (!userId) {
    return null;
  }

  if (isLoadingUser || isLoadingStats || !user || !stats) {
    return (
      <div className="min-h-screen flex flex-col bg-discord-darkest text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="animate-spin h-12 w-12 text-indigo-600 mx-auto" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Loading your Discord Wrapped...</h2>
            <p className="text-gray-400 mt-2">
              {selectedPeriod === 'all-time' 
                ? "This may take a moment while we analyze your entire Discord history." 
                : `This may take a moment while we analyze your ${selectedPeriod} data.`}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-discord-darkest text-white">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection user={user} stats={stats} />
        
        {/* Time Period Selector */}
        <div className="container mx-auto py-6">
          <div className="bg-discord-dark rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Select Time Period</h2>
            <Tabs 
              defaultValue={selectedPeriod} 
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full">
                {availableYears.map((yearOption) => (
                  <TabsTrigger 
                    key={yearOption.id} 
                    value={yearOption.id}
                    className="text-center"
                  >
                    {yearOption.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <p className="text-gray-400 mt-4 text-sm">
              {selectedPeriod === 'all-time' 
                ? "Viewing statistics across your entire Discord history" 
                : `Viewing statistics for ${selectedPeriod}`}
            </p>
          </div>
        </div>
        
        <StatsHighlights stats={stats} />
        <ActivityPatterns heatmap={stats.activityHeatmap as number[][]} />
        <TopChannelsAndServers 
          topServers={stats.topServers as Server[]} 
          topChannels={stats.topChannels as Channel[]} 
        />
        <MessageAnalysis 
          messageTypes={stats.messageTypes as MessageTypes} 
          commonWords={stats.commonWords as WordCount[]} 
        />
        <YearlyProgress 
          messagesByMonth={stats.messagesByMonth as Record<string, number>} 
          stats={stats} 
        />
        <ShareSection username={user.discordUsername || user.username} />
      </main>
      
      <Footer />
    </div>
  );
}