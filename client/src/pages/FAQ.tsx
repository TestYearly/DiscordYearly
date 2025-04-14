import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-gray-300">
              Find answers to common questions about Discord Wrapped
            </p>
          </div>
        </section>
        
        {/* FAQ Content */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">What is Discord Wrapped?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Discord Wrapped is a tool that analyzes your Discord activity throughout the year and provides you with a personalized summary of your chat behavior, favorite channels, message patterns, and more. It's similar to Spotify Wrapped but for your Discord usage.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">Is Discord Wrapped official?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  No, Discord Wrapped is not affiliated with Discord Inc. It's a third-party project created by developers who are passionate about Discord and data visualization.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">Is it safe to connect my Discord account?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Yes, we use Discord's official OAuth2 authentication system, which means we never see your password. We only request read access to analyze your activity data, and you can revoke access at any time from your Discord settings.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">What data do you collect?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  We analyze metadata about your messages (timestamps, channels, etc.), voice activity, and reactions. We don't store or analyze the actual content of your messages, and all data processing is done securely.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">How far back does the data go?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Discord Wrapped analyzes your activity for the current calendar year. If you connect in the middle of the year, it will show statistics for the months that have passed so far.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">Can I see previous years?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Currently, Discord Wrapped only shows data for the current year. We're working on adding historical data in future updates.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">How can I share my Discord Wrapped?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  After viewing your Discord Wrapped, you'll have options to download an image summary or share directly to social media platforms including Twitter, Facebook, Instagram, and Discord itself.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="bg-discord-dark rounded-lg border-none px-6">
                <AccordionTrigger className="text-lg font-medium py-4">How often is the data updated?</AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  Your Discord Wrapped statistics are updated daily. When you view your wrapped, you're seeing data that's current as of the previous day.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="mb-6 text-gray-400">Still have questions? Contact us at support@discordwrapped.com</p>
              
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
