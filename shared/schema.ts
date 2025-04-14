import { pgTable, text, serial, integer, boolean, json, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  discordId: text("discord_id").unique(),
  discordUsername: text("discord_username"),
  discordAvatar: text("discord_avatar"),
  discordJoinedAt: timestamp("discord_joined_at"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  discordId: true,
  discordUsername: true,
  discordAvatar: true,
  discordJoinedAt: true,
  accessToken: true,
  refreshToken: true,
});

// Server table
export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  discordServerId: text("discord_server_id").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon"),
  memberCount: integer("member_count"),
});

export const insertServerSchema = createInsertSchema(servers).pick({
  discordServerId: true,
  name: true,
  icon: true,
  memberCount: true,
});

// Channel table
export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  discordChannelId: text("discord_channel_id").notNull().unique(),
  serverId: integer("server_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
});

export const insertChannelSchema = createInsertSchema(channels).pick({
  discordChannelId: true,
  serverId: true,
  name: true,
  type: true,
});

// Message table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  discordMessageId: text("discord_message_id").notNull().unique(),
  channelId: integer("channel_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content"),
  attachmentCount: integer("attachment_count").default(0),
  linkCount: integer("link_count").default(0),
  codeSnippetCount: integer("code_snippet_count").default(0),
  createdAt: timestamp("created_at").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  discordMessageId: true,
  channelId: true,
  userId: true,
  content: true,
  attachmentCount: true,
  linkCount: true,
  codeSnippetCount: true,
  createdAt: true,
});

// Voice activity table
export const voiceActivities = pgTable("voice_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  channelId: integer("channel_id").notNull(),
  duration: integer("duration").notNull(), // in seconds
  joinedAt: timestamp("joined_at").notNull(),
  leftAt: timestamp("left_at").notNull(),
});

export const insertVoiceActivitySchema = createInsertSchema(voiceActivities).pick({
  userId: true,
  channelId: true,
  duration: true,
  joinedAt: true,
  leftAt: true,
});

// Reaction table
export const reactions = pgTable("reactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  messageId: integer("message_id").notNull(),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const insertReactionSchema = createInsertSchema(reactions).pick({
  userId: true,
  messageId: true,
  emoji: true,
  createdAt: true,
});

// UserStats table for cached yearly stats
export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  year: integer("year").notNull(),
  totalMessages: integer("total_messages").notNull().default(0),
  totalVoiceMinutes: integer("total_voice_minutes").notNull().default(0),
  totalReactions: integer("total_reactions").notNull().default(0),
  topServers: json("top_servers").notNull().default([]),
  topChannels: json("top_channels").notNull().default([]),
  messagesByMonth: json("messages_by_month").notNull().default([]),
  activityHeatmap: json("activity_heatmap").notNull().default([]),
  commonWords: json("common_words").notNull().default([]),
  messageTypes: json("message_types").notNull().default({}),
  lastUpdated: timestamp("last_updated").notNull(),
});

export const insertUserStatsSchema = createInsertSchema(userStats).pick({
  userId: true,
  year: true,
  totalMessages: true,
  totalVoiceMinutes: true,
  totalReactions: true,
  topServers: true,
  topChannels: true,
  messagesByMonth: true,
  activityHeatmap: true,
  commonWords: true,
  messageTypes: true,
  lastUpdated: true,
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertServer = z.infer<typeof insertServerSchema>;
export type Server = typeof servers.$inferSelect;

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertVoiceActivity = z.infer<typeof insertVoiceActivitySchema>;
export type VoiceActivity = typeof voiceActivities.$inferSelect;

export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type Reaction = typeof reactions.$inferSelect;

export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;
