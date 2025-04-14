import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function About() {
  const [_, setLocation] = useLocation();

  const handleConnectDiscord = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <div className="min-h-screen flex flex-col bg-discord-darkest text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="py-20 px-6 bg-discord-darker relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent opacity-70"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Discord Wrapped</h1>
            <p className="text-lg md:text-xl text-gray-300">
              Discover the story behind your yearly Discord activity summary
            </p>
          </div>
        </section>
        
        {/* About Content */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-lg prose-invert mx-auto">
              <h2>What is Discord Wrapped?</h2>
              <p>
                Discord Wrapped is a project that analyzes your Discord activity and generates a personalized yearly summary. 
                Similar to Spotify Wrapped, it shows you your chat behavior, favorite channels, messaging patterns, and more.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                We believe that data visualization can provide fascinating insights into how we communicate online. 
                Our mission is to help Discord users understand their usage patterns in a fun, engaging way while 
                respecting privacy and data security.
              </p>
              
              <h2>How It Works</h2>
              <p>
                When you connect your Discord account, we analyze your message history, voice activity, reactions, and other
                interactions. Our algorithms process this data to create beautiful visualizations and interesting statistics
                about your Discord usage throughout the year.
              </p>
              
              <h2>Privacy & Security</h2>
              <p>
                We take privacy seriously. We only request read access to your Discord data, and we never store messages content.
                All data processing is done securely, and you can delete your data at any time. We use OAuth2 for secure authentication
                and never ask for your Discord password.
              </p>
              
              <h2>The Team</h2>
              <p>
                Discord Wrapped was created by a team of Discord enthusiasts who wanted to bring the joy of yearly wrap-ups to
                the Discord platform. We're constantly working to improve the experience and add new insights.
              </p>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                size="lg" 
                onClick={handleConnectDiscord}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
              >
                <svg 
                  className="w-6 h-6 mr-2" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"/>
                </svg>
                Get Your Discord Wrapped
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
