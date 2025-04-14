// Discord User Types
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

// Discord Guild (Server) Types
export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
  permissions?: number;
  features: string[];
  permissions_new?: string;
  memberCount?: number;
}

// Discord Channel Types
export interface DiscordChannel {
  id: string;
  type: number;
  guild_id?: string;
  position?: number;
  permission_overwrites?: any[];
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: DiscordUser[];
  icon?: string | null;
  owner_id?: string;
  application_id?: string;
  parent_id?: string | null;
  last_pin_timestamp?: string | null;
}

// Discord Message Types
export interface DiscordMessage {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: DiscordUser[];
  mention_roles: string[];
  attachments: DiscordAttachment[];
  embeds: DiscordEmbed[];
  reactions?: DiscordReaction[];
  pinned: boolean;
  webhook_id?: string;
  type: number;
  activity?: DiscordMessageActivity;
  application?: DiscordMessageApplication;
  message_reference?: DiscordMessageReference;
  flags?: number;
  referenced_message?: DiscordMessage | null;
  interaction?: DiscordMessageInteraction;
  thread?: DiscordChannel;
  components?: any[];
  sticker_items?: DiscordStickerItem[];
}

// Discord Attachment Type
export interface DiscordAttachment {
  id: string;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number | null;
  width?: number | null;
  ephemeral?: boolean;
}

// Discord Embed Type
export interface DiscordEmbed {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  image?: {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  thumbnail?: {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  video?: {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
  };
  provider?: {
    name?: string;
    url?: string;
  };
  author?: {
    name?: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

// Discord Reaction Type
export interface DiscordReaction {
  count: number;
  me: boolean;
  emoji: {
    id: string | null;
    name: string;
    animated?: boolean;
  };
}

// Discord Message Activity Type
export interface DiscordMessageActivity {
  type: number;
  party_id?: string;
}

// Discord Message Application Type
export interface DiscordMessageApplication {
  id: string;
  cover_image?: string;
  description: string;
  icon: string | null;
  name: string;
}

// Discord Message Reference Type
export interface DiscordMessageReference {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
}

// Discord Message Interaction Type
export interface DiscordMessageInteraction {
  id: string;
  type: number;
  name: string;
  user: DiscordUser;
}

// Discord Sticker Item Type
export interface DiscordStickerItem {
  id: string;
  name: string;
  format_type: number;
}

// Discord Voice State
export interface DiscordVoiceState {
  guild_id?: string;
  channel_id: string | null;
  user_id: string;
  member?: any;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
  request_to_speak_timestamp: string | null;
}
