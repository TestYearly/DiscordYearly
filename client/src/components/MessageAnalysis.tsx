import { useState } from "react";

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

interface MessageAnalysisProps {
  messageTypes: MessageTypes;
  commonWords: WordCount[];
}

export default function MessageAnalysis({ messageTypes, commonWords }: MessageAnalysisProps) {
  // Sort words by count for the word cloud
  const sortedWords = [...commonWords].sort((a, b) => b.count - a.count);
  
  // Calculate font sizes based on count
  const maxCount = sortedWords.length > 0 ? sortedWords[0].count : 0;
  const getWordSize = (count: number) => {
    if (maxCount === 0) return 1;
    const ratio = count / maxCount;
    // Map ratio to font size between 0.8rem and 1.5rem
    return 0.8 + (ratio * 0.7);
  };
  
  // Calculate opacity based on count
  const getWordOpacity = (count: number) => {
    if (maxCount === 0) return 0.2;
    return 0.3 + ((count / maxCount) * 0.7);
  };

  return (
    <section className="py-16 px-6 bg-discord-darker relative overflow-hidden section-fade">
      <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/5 opacity-50"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Your Message Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Message Types */}
          <div className="bg-discord-dark rounded-xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Message Types</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Text Messages</span>
                  <span className="font-bold">{messageTypes.text.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full activity-bar" 
                    style={{ width: `${messageTypes.text}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Images & Media</span>
                  <span className="font-bold">{messageTypes.media.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full activity-bar" 
                    style={{ width: `${messageTypes.media}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Links</span>
                  <span className="font-bold">{messageTypes.links.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full activity-bar" 
                    style={{ width: `${messageTypes.links}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Code Snippets</span>
                  <span className="font-bold">{messageTypes.code.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-yellow-500 h-3 rounded-full activity-bar" 
                    style={{ width: `${messageTypes.code}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Common Words */}
          <div className="bg-discord-dark rounded-xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6">Your Most Used Words</h3>
            
            {commonWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sortedWords.map((wordData, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `rgba(88, 101, 242, ${getWordOpacity(wordData.count)})`,
                      fontSize: `${getWordSize(wordData.count)}rem`
                    }}
                  >
                    {wordData.word}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-500">
                <p>No word data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
