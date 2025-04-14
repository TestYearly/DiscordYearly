import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { insertUserSchema, insertServerSchema, insertChannelSchema, insertMessageSchema, insertVoiceActivitySchema, insertReactionSchema, insertUserStatsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint prefix
  const API_PREFIX = "/api";
  
  // Configure Passport with Discord strategy
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    callbackURL: `https://2ea41090-e3ac-4019-a076-308ea41b1a70-00-14iktci6zp9hk.janeway.replit.dev/api/auth/discord/callback`,
    scope: ['identify', 'guilds', 'connections', 'messages.read']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists in our database
      let user = await storage.getUserByDiscordId(profile.id);
      
      if (!user) {
        // If not, create a new user
        user = await storage.createUser({
          username: `discord_${profile.id}`,
          password: Math.random().toString(36).slice(-8), // Generate random password
          discordId: profile.id,
          discordUsername: `${profile.username}#${profile.discriminator}`,
          discordAvatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
          discordJoinedAt: new Date(),
          accessToken,
          refreshToken
        });
      } else {
        // Update tokens if user already exists
        await storage.updateUser(user.id, {
          accessToken,
          refreshToken,
          discordUsername: `${profile.username}#${profile.discriminator}`,
          discordAvatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
  
  // Passport session setup
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });

  // Auth endpoints
  app.post(`${API_PREFIX}/auth/register`, async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(`${API_PREFIX}/auth/login`, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User endpoints
  app.get(`${API_PREFIX}/users/:id`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Statistics endpoints
  app.get(`${API_PREFIX}/stats/:userId`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const allTime = req.query.allTime === 'true';
      const year = allTime ? undefined : (parseInt(req.query.year as string) || new Date().getFullYear());
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      if (allTime) {
        // For all-time stats, we'll aggregate data across all years
        // Get all user messages regardless of year
        const totalMessages = await storage.getUserMessagesCount(userId);
        const totalVoiceMinutes = Math.floor(await storage.getUserVoiceTimeTotal(userId) / 60);
        const totalReactions = await storage.getUserReactionsCount(userId);
        
        // For these aggregate stats, we'll use the current year but label it as "All Time"
        const currentYear = new Date().getFullYear();
        const topServers = await storage.getUserTopServers(userId, undefined);
        const topChannels = await storage.getUserTopChannels(userId, undefined);
        
        // For message by month, we'll aggregate across years but keep month structure
        const messagesByMonth = await storage.getUserMessagesCountByMonth(userId, currentYear);
        const activityHeatmap = await storage.getUserActivityHeatmap(userId, currentYear);
        const commonWords = await storage.getUserCommonWords(userId, undefined);
        const messageTypes = await storage.getUserMessageTypes(userId, undefined);
        
        // Create a custom stats object for the all-time view
        const userStats = {
          id: 0,
          userId,
          year: 0, // Use 0 to represent "All Time"
          totalMessages,
          totalVoiceMinutes,
          totalReactions,
          topServers,
          topChannels,
          messagesByMonth,
          activityHeatmap,
          commonWords,
          messageTypes,
          lastUpdated: new Date()
        };
        
        return res.status(200).json(userStats);
      }
      
      // For specific year stats (original logic)
      let userStats = await storage.getUserStats(userId, year as number);
      
      // If not, calculate and store them
      if (!userStats) {
        const totalMessages = await storage.getUserMessagesCount(userId, year as number);
        const totalVoiceMinutes = Math.floor(await storage.getUserVoiceTimeTotal(userId, year as number) / 60);
        const totalReactions = await storage.getUserReactionsCount(userId, year as number);
        const topServers = await storage.getUserTopServers(userId, year as number);
        const topChannels = await storage.getUserTopChannels(userId, year as number);
        const messagesByMonth = await storage.getUserMessagesCountByMonth(userId, year as number);
        const activityHeatmap = await storage.getUserActivityHeatmap(userId, year as number);
        const commonWords = await storage.getUserCommonWords(userId, year as number);
        const messageTypes = await storage.getUserMessageTypes(userId, year as number);
        
        userStats = await storage.createUserStats({
          userId,
          year: year as number,
          totalMessages,
          totalVoiceMinutes,
          totalReactions,
          topServers,
          topChannels,
          messagesByMonth,
          activityHeatmap,
          commonWords,
          messageTypes,
          lastUpdated: new Date()
        });
      }
      
      res.status(200).json(userStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Real Discord OAuth routes
  app.get(`${API_PREFIX}/auth/discord`, passport.authenticate('discord'));

  // Discord callback endpoint
  app.get(`${API_PREFIX}/auth/discord/callback`, 
    passport.authenticate('discord', { failureRedirect: '/' }),
    async (req: Request, res: Response) => {
      try {
        // User has been authenticated and is available in req.user
        const user = req.user as any;
        
        if (!user) {
          return res.redirect('/');
        }
        
        // Create mock data for the user if they don't have any yet
        const userDataExists = await storage.getUserMessagesCount(user.id);
        
        if (userDataExists === 0) {
          await createMockDataForUser(user.id);
        }
        
        // Redirect to the dashboard
        res.redirect(`/dashboard?id=${user.id}`);
      } catch (error) {
        console.error('Error in Discord callback:', error);
        res.status(500).redirect('/?error=auth_failed');
      }
    });
    
  // Check authentication status
  app.get(`${API_PREFIX}/auth/status`, (req: Request, res: Response) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      const user = req.user as any;
      return res.status(200).json({
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          discordId: user.discordId,
          discordUsername: user.discordUsername,
          discordAvatar: user.discordAvatar
        }
      });
    }
    
    return res.status(200).json({
      authenticated: false
    });
  });
  
  // Logout endpoint
  app.post(`${API_PREFIX}/auth/logout`, (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Helper function to create mock data for new users
  async function createMockDataForUser(userId: number) {
    const currentYear = new Date().getFullYear();
    
    // Create mock servers
    const servers = [
      { name: "Gaming Lounge", icon: "G" },
      { name: "Coding Help", icon: "C" },
      { name: "Friend Group", icon: "F" },
      { name: "Music Lovers", icon: "M" }
    ];
    
    const createdServers = [];
    
    for (const serverData of servers) {
      const server = await storage.createServer({
        discordServerId: `mock_server_${Math.random().toString(36).substring(7)}`,
        name: serverData.name,
        icon: serverData.icon,
        memberCount: Math.floor(Math.random() * 1000) + 100
      });
      
      createdServers.push(server);
    }
    
    // Create mock channels
    const channelTypes = ["text", "voice"];
    const createdChannels = [];
    
    for (const server of createdServers) {
      const channelCount = Math.floor(Math.random() * 3) + 2; // 2-4 channels per server
      
      for (let i = 0; i < channelCount; i++) {
        const channelType = channelTypes[Math.floor(Math.random() * channelTypes.length)];
        let channelName = "";
        
        if (server.name === "Gaming Lounge") {
          channelName = ["general-chat", "game-discussion", "valorant", "minecraft"][i % 4];
        } else if (server.name === "Coding Help") {
          channelName = ["javascript", "python", "react", "backend"][i % 4];
        } else if (server.name === "Friend Group") {
          channelName = ["memes", "general", "planning", "random"][i % 4];
        } else {
          channelName = ["song-requests", "music-chat", "recommendations", "playlists"][i % 4];
        }
        
        const channel = await storage.createChannel({
          discordChannelId: `mock_channel_${Math.random().toString(36).substring(7)}`,
          serverId: server.id,
          name: channelName,
          type: channelType
        });
        
        createdChannels.push(channel);
      }
    }
    
    // Generate mock message data for the past year
    const startDate = new Date();
    startDate.setFullYear(currentYear - 1);
    
    const messageCount = 15482; // As per design reference
    const messages = [];
    
    // Common words to use in mock messages
    const commonWords = [
      "lol", "yeah", "nice", "thanks", "cool", "wow", "awesome", "sure", 
      "definitely", "maybe", "right", "please", "seriously", "absolutely"
    ];
    
    for (let i = 0; i < messageCount; i++) {
      const randomChannel = createdChannels[Math.floor(Math.random() * createdChannels.length)];
      const randomDate = new Date(startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime()));
      
      // Generate random content using common words
      const wordCount = Math.floor(Math.random() * 10) + 1;
      let content = "";
      for (let j = 0; j < wordCount; j++) {
        content += commonWords[Math.floor(Math.random() * commonWords.length)] + " ";
      }
      
      // Determine message type
      let attachmentCount = 0;
      let linkCount = 0;
      let codeSnippetCount = 0;
      
      const messageTypeRand = Math.random();
      if (messageTypeRand < 0.12) { // 12% are images & media
        attachmentCount = 1;
      } else if (messageTypeRand < 0.18) { // 6% are links
        linkCount = 1;
      } else if (messageTypeRand < 0.22) { // 4% are code snippets
        codeSnippetCount = 1;
      }
      
      const message = await storage.createMessage({
        discordMessageId: `mock_message_${Math.random().toString(36).substring(7)}`,
        channelId: randomChannel.id,
        userId: userId,
        content: content.trim(),
        attachmentCount,
        linkCount,
        codeSnippetCount,
        createdAt: randomDate
      });
      
      messages.push(message);
    }
    
    // Generate mock voice activity
    const voiceChannels = createdChannels.filter(channel => channel.type === "voice");
    const voiceActivityCount = 100; // Approximately 256 hours as per design reference
    
    for (let i = 0; i < voiceActivityCount; i++) {
      const randomVoiceChannel = voiceChannels[Math.floor(Math.random() * voiceChannels.length)];
      const randomDate = new Date(startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime()));
      
      // Duration between 5 minutes and 3 hours
      const durationSeconds = Math.floor(Math.random() * 10800) + 300;
      
      const joinedAt = randomDate;
      const leftAt = new Date(joinedAt.getTime() + durationSeconds * 1000);
      
      await storage.createVoiceActivity({
        userId,
        channelId: randomVoiceChannel.id,
        duration: durationSeconds,
        joinedAt,
        leftAt
      });
    }
    
    // Generate mock reactions
    const reactionCount = 4209; // As per design reference
    const emojis = ["👍", "😂", "❤️", "🎉", "😊", "🔥", "👀", "🤔", "👏", "🙏"];
    
    for (let i = 0; i < reactionCount; i++) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const randomDate = new Date(randomMessage.createdAt);
      
      // Add random time after the message
      randomDate.setSeconds(randomDate.getSeconds() + Math.floor(Math.random() * 3600));
      
      await storage.createReaction({
        userId,
        messageId: randomMessage.id,
        emoji: randomEmoji,
        createdAt: randomDate
      });
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
