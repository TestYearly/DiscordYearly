import {
  User, InsertUser, 
  Server, InsertServer,
  Channel, InsertChannel,
  Message, InsertMessage,
  VoiceActivity, InsertVoiceActivity,
  Reaction, InsertReaction,
  UserStats, InsertUserStats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Server operations
  getServer(id: number): Promise<Server | undefined>;
  getServerByDiscordId(discordServerId: string): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  getUserServers(userId: number): Promise<Server[]>;

  // Channel operations
  getChannel(id: number): Promise<Channel | undefined>;
  getChannelByDiscordId(discordChannelId: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  getServerChannels(serverId: number): Promise<Channel[]>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: number): Promise<Message[]>;
  getChannelMessages(channelId: number): Promise<Message[]>;
  getServerMessages(serverId: number): Promise<Message[]>;
  getUserMessagesCount(userId: number, year?: number): Promise<number>;
  getUserMessagesCountByMonth(userId: number, year?: number): Promise<Record<string, number>>;

  // Voice activity operations
  createVoiceActivity(voiceActivity: InsertVoiceActivity): Promise<VoiceActivity>;
  getUserVoiceActivities(userId: number): Promise<VoiceActivity[]>;
  getUserVoiceTimeTotal(userId: number, year?: number): Promise<number>;

  // Reaction operations
  createReaction(reaction: InsertReaction): Promise<Reaction>;
  getUserReactions(userId: number): Promise<Reaction[]>;
  getUserReactionsCount(userId: number, year?: number): Promise<number>;
  getUserTopEmojis(userId: number, year?: number, limit?: number): Promise<{emoji: string, count: number}[]>;

  // User stats operations
  getUserStats(userId: number, year: number): Promise<UserStats | undefined>;
  createUserStats(userStats: InsertUserStats): Promise<UserStats>;
  updateUserStats(id: number, userStats: Partial<UserStats>): Promise<UserStats | undefined>;

  // Advanced analytics
  getUserActivityHeatmap(userId: number, year?: number): Promise<any[]>;
  getUserTopServers(userId: number, year?: number, limit?: number): Promise<any[]>;
  getUserTopChannels(userId: number, year?: number, limit?: number): Promise<any[]>;
  getUserCommonWords(userId: number, year?: number, limit?: number): Promise<any[]>;
  getUserMessageTypes(userId: number, year?: number): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private servers: Map<number, Server>;
  private channels: Map<number, Channel>;
  private messages: Map<number, Message>;
  private voiceActivities: Map<number, VoiceActivity>;
  private reactions: Map<number, Reaction>;
  private userStatsList: Map<number, UserStats>;

  private userCurrentId: number;
  private serverCurrentId: number;
  private channelCurrentId: number;
  private messageCurrentId: number;
  private voiceActivityCurrentId: number;
  private reactionCurrentId: number;
  private userStatsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.servers = new Map();
    this.channels = new Map();
    this.messages = new Map();
    this.voiceActivities = new Map();
    this.reactions = new Map();
    this.userStatsList = new Map();

    this.userCurrentId = 1;
    this.serverCurrentId = 1;
    this.channelCurrentId = 1;
    this.messageCurrentId = 1;
    this.voiceActivityCurrentId = 1;
    this.reactionCurrentId = 1;
    this.userStatsCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.discordId === discordId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Server operations
  async getServer(id: number): Promise<Server | undefined> {
    return this.servers.get(id);
  }

  async getServerByDiscordId(discordServerId: string): Promise<Server | undefined> {
    return Array.from(this.servers.values()).find(
      (server) => server.discordServerId === discordServerId,
    );
  }

  async createServer(insertServer: InsertServer): Promise<Server> {
    const id = this.serverCurrentId++;
    const server: Server = { ...insertServer, id };
    this.servers.set(id, server);
    return server;
  }

  async getUserServers(userId: number): Promise<Server[]> {
    // Get all channels for user's messages
    const userMessages = await this.getUserMessages(userId);
    const channelIds = [...new Set(userMessages.map(msg => msg.channelId))];
    
    // Get all servers for those channels
    const serverIds = new Set<number>();
    for (const channelId of channelIds) {
      const channel = await this.getChannel(channelId);
      if (channel) {
        serverIds.add(channel.serverId);
      }
    }
    
    // Return all those servers
    return Array.from(serverIds).map(id => this.servers.get(id)).filter(Boolean) as Server[];
  }

  // Channel operations
  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async getChannelByDiscordId(discordChannelId: string): Promise<Channel | undefined> {
    return Array.from(this.channels.values()).find(
      (channel) => channel.discordChannelId === discordChannelId,
    );
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const id = this.channelCurrentId++;
    const channel: Channel = { ...insertChannel, id };
    this.channels.set(id, channel);
    return channel;
  }

  async getServerChannels(serverId: number): Promise<Channel[]> {
    return Array.from(this.channels.values()).filter(
      (channel) => channel.serverId === serverId,
    );
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const message: Message = { ...insertMessage, id };
    this.messages.set(id, message);
    return message;
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId,
    );
  }

  async getChannelMessages(channelId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.channelId === channelId,
    );
  }

  async getServerMessages(serverId: number): Promise<Message[]> {
    const serverChannels = await this.getServerChannels(serverId);
    const channelIds = serverChannels.map((channel) => channel.id);
    
    return Array.from(this.messages.values()).filter(
      (message) => channelIds.includes(message.channelId),
    );
  }

  async getUserMessagesCount(userId: number, year?: number): Promise<number> {
    const userMessages = await this.getUserMessages(userId);
    
    if (!year) {
      return userMessages.length;
    }
    
    return userMessages.filter((message) => {
      const messageYear = new Date(message.createdAt).getFullYear();
      return messageYear === year;
    }).length;
  }

  async getUserMessagesCountByMonth(userId: number, year?: number): Promise<Record<string, number>> {
    const userMessages = await this.getUserMessages(userId);
    const messagesByMonth: Record<string, number> = {};
    
    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      messagesByMonth[i.toString()] = 0;
    }

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // If no year provided, count all messages by month across all years
    // Or count only for the specified year
    if (year === undefined) {
      userMessages.forEach((message) => {
        const messageDate = new Date(message.createdAt);
        const messageMonth = messageDate.getMonth();
        messagesByMonth[messageMonth.toString()] += 1;
      });
    } else {
      userMessages.forEach((message) => {
        const messageDate = new Date(message.createdAt);
        const messageYear = messageDate.getFullYear();
        const messageMonth = messageDate.getMonth();
        
        if (messageYear === year) {
          messagesByMonth[messageMonth.toString()] += 1;
        }
      });
    }
    
    return messagesByMonth;
  }

  // Voice activity operations
  async createVoiceActivity(insertVoiceActivity: InsertVoiceActivity): Promise<VoiceActivity> {
    const id = this.voiceActivityCurrentId++;
    const voiceActivity: VoiceActivity = { ...insertVoiceActivity, id };
    this.voiceActivities.set(id, voiceActivity);
    return voiceActivity;
  }

  async getUserVoiceActivities(userId: number): Promise<VoiceActivity[]> {
    return Array.from(this.voiceActivities.values()).filter(
      (voiceActivity) => voiceActivity.userId === userId,
    );
  }

  async getUserVoiceTimeTotal(userId: number, year?: number): Promise<number> {
    const userVoiceActivities = await this.getUserVoiceActivities(userId);
    
    if (!year) {
      return userVoiceActivities.reduce((total, activity) => total + activity.duration, 0);
    }
    
    return userVoiceActivities
      .filter((activity) => {
        const activityYear = new Date(activity.joinedAt).getFullYear();
        return activityYear === year;
      })
      .reduce((total, activity) => total + activity.duration, 0);
  }

  // Reaction operations
  async createReaction(insertReaction: InsertReaction): Promise<Reaction> {
    const id = this.reactionCurrentId++;
    const reaction: Reaction = { ...insertReaction, id };
    this.reactions.set(id, reaction);
    return reaction;
  }

  async getUserReactions(userId: number): Promise<Reaction[]> {
    return Array.from(this.reactions.values()).filter(
      (reaction) => reaction.userId === userId,
    );
  }

  async getUserReactionsCount(userId: number, year?: number): Promise<number> {
    const userReactions = await this.getUserReactions(userId);
    
    if (!year) {
      return userReactions.length;
    }
    
    return userReactions.filter((reaction) => {
      const reactionYear = new Date(reaction.createdAt).getFullYear();
      return reactionYear === year;
    }).length;
  }

  async getUserTopEmojis(userId: number, year?: number, limit: number = 5): Promise<{emoji: string, count: number}[]> {
    const userReactions = await this.getUserReactions(userId);
    const filteredReactions = year === undefined ? userReactions : userReactions.filter((reaction) => {
      const reactionYear = new Date(reaction.createdAt).getFullYear();
      return reactionYear === year;
    });
    
    const emojiCounts: Record<string, number> = {};
    filteredReactions.forEach((reaction) => {
      if (emojiCounts[reaction.emoji]) {
        emojiCounts[reaction.emoji] += 1;
      } else {
        emojiCounts[reaction.emoji] = 1;
      }
    });
    
    return Object.entries(emojiCounts)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // User stats operations
  async getUserStats(userId: number, year: number): Promise<UserStats | undefined> {
    return Array.from(this.userStatsList.values()).find(
      (stats) => stats.userId === userId && stats.year === year,
    );
  }

  async createUserStats(insertUserStats: InsertUserStats): Promise<UserStats> {
    const id = this.userStatsCurrentId++;
    const userStats: UserStats = { ...insertUserStats, id };
    this.userStatsList.set(id, userStats);
    return userStats;
  }

  async updateUserStats(id: number, userStatsData: Partial<UserStats>): Promise<UserStats | undefined> {
    const userStats = this.userStatsList.get(id);
    if (!userStats) return undefined;
    
    const updatedUserStats = { ...userStats, ...userStatsData };
    this.userStatsList.set(id, updatedUserStats);
    return updatedUserStats;
  }

  // Advanced analytics
  async getUserActivityHeatmap(userId: number, year?: number): Promise<any[]> {
    const userMessages = await this.getUserMessages(userId);
    const filteredMessages = year === undefined ? userMessages : userMessages.filter((message) => {
      const messageYear = new Date(message.createdAt).getFullYear();
      return messageYear === year;
    });
    
    // Create a 7x24 array (days x hours) initialized with zeros
    const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
    
    filteredMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const day = messageDate.getDay(); // 0-6 (Sunday-Saturday)
      const hour = messageDate.getHours(); // 0-23
      
      heatmap[day][hour] += 1;
    });
    
    return heatmap;
  }

  async getUserTopServers(userId: number, year?: number, limit: number = 4): Promise<any[]> {
    const userMessages = await this.getUserMessages(userId);
    const filteredMessages = year === undefined ? userMessages : userMessages.filter((message) => {
      const messageYear = new Date(message.createdAt).getFullYear();
      return messageYear === year;
    });
    
    // Count messages by channel
    const channelCounts: Record<number, number> = {};
    filteredMessages.forEach((message) => {
      if (channelCounts[message.channelId]) {
        channelCounts[message.channelId] += 1;
      } else {
        channelCounts[message.channelId] = 1;
      }
    });
    
    // Group by server
    const serverCounts: Record<number, number> = {};
    for (const [channelIdStr, count] of Object.entries(channelCounts)) {
      const channelId = parseInt(channelIdStr);
      const channel = await this.getChannel(channelId);
      if (channel) {
        if (serverCounts[channel.serverId]) {
          serverCounts[channel.serverId] += count;
        } else {
          serverCounts[channel.serverId] = count;
        }
      }
    }
    
    // Map to server objects with message counts
    const serverObjects = await Promise.all(
      Object.entries(serverCounts).map(async ([serverIdStr, count]) => {
        const serverId = parseInt(serverIdStr);
        const server = await this.getServer(serverId);
        return {
          id: serverId,
          name: server?.name || "Unknown Server",
          icon: server?.icon || "",
          messageCount: count
        };
      })
    );
    
    return serverObjects
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, limit);
  }

  async getUserTopChannels(userId: number, year?: number, limit: number = 4): Promise<any[]> {
    const userMessages = await this.getUserMessages(userId);
    const filteredMessages = year === undefined ? userMessages : userMessages.filter((message) => {
      const messageYear = new Date(message.createdAt).getFullYear();
      return messageYear === year;
    });
    
    // Count messages by channel
    const channelCounts: Record<number, number> = {};
    filteredMessages.forEach((message) => {
      if (channelCounts[message.channelId]) {
        channelCounts[message.channelId] += 1;
      } else {
        channelCounts[message.channelId] = 1;
      }
    });
    
    // Map to channel objects with message counts and server info
    const channelObjects = await Promise.all(
      Object.entries(channelCounts).map(async ([channelIdStr, count]) => {
        const channelId = parseInt(channelIdStr);
        const channel = await this.getChannel(channelId);
        let serverName = "Unknown Server";
        
        if (channel) {
          const server = await this.getServer(channel.serverId);
          if (server) {
            serverName = server.name;
          }
        }
        
        return {
          id: channelId,
          name: channel?.name || "Unknown Channel",
          serverName,
          messageCount: count,
          percentage: 0 // Will be calculated after sorting
        };
      })
    );
    
    // Sort and slice
    const sortedChannels = channelObjects
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, limit);
    
    // Calculate percentages relative to the top channel
    if (sortedChannels.length > 0) {
      const topCount = sortedChannels[0].messageCount;
      sortedChannels.forEach(channel => {
        channel.percentage = (channel.messageCount / topCount) * 100;
      });
    }
    
    return sortedChannels;
  }

  async getUserCommonWords(userId: number, year?: number, limit: number = 20): Promise<any[]> {
    const userMessages = await this.getUserMessages(userId);
    const filteredMessages = year === undefined ? userMessages : userMessages.filter((message) => {
      const messageYear = new Date(message.createdAt).getFullYear();
      return messageYear === year;
    });
    
    // Combine all message content
    const allContent = filteredMessages
      .map(message => message.content || "")
      .join(" ");
    
    // Split into words and count occurrences
    const words = allContent
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 2); // Filter out short words
    
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      if (wordCounts[word]) {
        wordCounts[word] += 1;
      } else {
        wordCounts[word] = 1;
      }
    });
    
    // Filter out common words like "the", "and", etc.
    const commonStopWords = ["the", "and", "this", "that", "for", "with", "not", "have", "from"];
    const filteredWordCounts = Object.entries(wordCounts)
      .filter(([word]) => !commonStopWords.includes(word));
    
    return filteredWordCounts
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getUserMessageTypes(userId: number, year?: number): Promise<any> {
    const userMessages = await this.getUserMessages(userId);
    const filteredMessages = year === undefined ? userMessages : userMessages.filter((message) => {
      const messageYear = new Date(message.createdAt).getFullYear();
      return messageYear === year;
    });
    
    if (filteredMessages.length === 0) {
      return {
        text: 0,
        media: 0,
        links: 0,
        code: 0
      };
    }
    
    let textCount = 0;
    let mediaCount = 0;
    let linkCount = 0;
    let codeCount = 0;
    
    filteredMessages.forEach(message => {
      if (message.attachmentCount > 0) {
        mediaCount++;
      } else if (message.linkCount > 0) {
        linkCount++;
      } else if (message.codeSnippetCount > 0) {
        codeCount++;
      } else {
        textCount++;
      }
    });
    
    const total = filteredMessages.length;
    
    return {
      text: (textCount / total) * 100,
      media: (mediaCount / total) * 100,
      links: (linkCount / total) * 100,
      code: (codeCount / total) * 100
    };
  }
}

export const storage = new MemStorage();
