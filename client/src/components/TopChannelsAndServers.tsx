import { useState } from "react";

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

interface TopChannelsAndServersProps {
  topServers: Server[];
  topChannels: Channel[];
}

export default function TopChannelsAndServers({ topServers, topChannels }: TopChannelsAndServersProps) {
  return (
    <section className="py-16 px-6 section-fade">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Your Top Channels & Servers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Top Servers */}
          <div className="bg-discord-dark rounded-xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <svg className="w-5 h-5 text-indigo-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Top Servers
            </h3>
            
            <div className="space-y-4">
              {topServers.map((server, index) => (
                <div key={server.id} className="flex items-center p-3 bg-discord-darker rounded-lg hover:bg-discord-darkest transition cursor-pointer">
                  <div className={`w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center mr-4`}>
                    <span className="font-bold">{server.icon || server.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{server.name}</div>
                    <div className="text-sm text-gray-400">{server.messageCount.toLocaleString()} messages</div>
                  </div>
                  <div className="text-3xl font-bold text-indigo-500">#{index + 1}</div>
                </div>
              ))}

              {/* Show empty state if no servers */}
              {topServers.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  <p>No server data available yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Top Channels */}
          <div className="bg-discord-dark rounded-xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <svg className="w-5 h-5 text-indigo-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Top Channels
            </h3>
            
            <div className="space-y-4">
              {topChannels.map((channel) => (
                <div key={channel.id} className="flex items-center p-3 bg-discord-darker rounded-lg hover:bg-discord-darkest transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-sm text-gray-400">{channel.serverName}</div>
                  </div>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full activity-bar" 
                      style={{ width: `${channel.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {/* Show empty state if no channels */}
              {topChannels.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  <p>No channel data available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
