import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Facebook, Instagram, Copy, Download } from "lucide-react";

interface ShareSectionProps {
  username: string;
}

export default function ShareSection({ username }: ShareSectionProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate share URL
  const shareUrl = `https://discord-wrapped.com/u/${username.replace("#", "_")}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
        duration: 3000,
      });
      
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
        duration: 3000,
      });
    });
  };
  
  const handleShare = (platform: string) => {
    // In a real implementation, this would share to social media
    toast({
      title: `Sharing to ${platform}`,
      description: "This would share your wrapped to social media",
      duration: 3000,
    });
  };
  
  const handleShareToDiscord = () => {
    // In a real implementation, this would share to Discord
    toast({
      title: "Sharing to Discord",
      description: "This would share your wrapped to Discord",
      duration: 3000,
    });
  };

  return (
    <section className="py-16 px-6 bg-discord-darker relative overflow-hidden section-fade">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-600/20 to-transparent opacity-70"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Share Your Discord Wrapped</h2>
        <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">Show your friends how you used Discord this year and compare your stats!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Button 
            className="bg-[#1DA1F2] hover:bg-[#1A91DA] p-4 h-auto"
            onClick={() => handleShare('Twitter')}
          >
            <Twitter className="w-5 h-5 mr-2" />
            Twitter
          </Button>
          
          <Button 
            className="bg-[#3b5998] hover:bg-[#344e86] p-4 h-auto"
            onClick={() => handleShare('Facebook')}
          >
            <Facebook className="w-5 h-5 mr-2" />
            Facebook
          </Button>
          
          <Button 
            className="bg-[#E1306C] hover:bg-[#c62d61] p-4 h-auto"
            onClick={() => handleShare('Instagram')}
          >
            <Instagram className="w-5 h-5 mr-2" />
            Instagram
          </Button>
          
          <Button 
            variant="outline" 
            className="bg-discord-dark border border-indigo-500 hover:bg-indigo-600/10 p-4 h-auto"
            onClick={() => handleShare('Download')}
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        </div>
        
        <div className="bg-discord-dark p-4 rounded-lg flex items-center justify-between mb-10">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="bg-discord-darkest text-gray-300 p-2 rounded flex-1 mr-4"
          />
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 h-auto"
            onClick={handleCopyLink}
          >
            <Copy className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="inline-block rounded-lg p-1" style={{ background: "linear-gradient(135deg, #FEE75C 0%, #EB459E 100%)" }}>
          <Button 
            variant="outline"
            className="bg-discord-darkest hover:bg-discord-darker px-8 py-3 h-auto"
            onClick={handleShareToDiscord}
          >
            <svg 
              className="w-6 h-6 mr-2" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z"/>
            </svg>
            Share to Discord
          </Button>
        </div>
      </div>
    </section>
  );
}
