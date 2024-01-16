import "dotenv/config";
import { ActivityType, Client, Events, IntentsBitField } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;

/**
 *
 * @returns {Promise<Client>}
 */
export const createDiscordBot = () =>
    new Promise((res, rej) => {
        const client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
            presence: {
                activities: [{ name: "Minecraft", type: ActivityType.Playing }],
                status: "online",
            },
        });

        client.once(Events.ClientReady, (readyClient) => {
            console.log(`Ready! Logged in as ${readyClient.user.tag}`);
            res(client);
        });

        client.on(Events.MessageCreate, (message) => {
            if (message.author.bot) return;
            if (message.channelId !== channelId) return;
            console.log(
                `Discord - ${message.author.username}: ${message.content}`
            );
            client.emit("guild_msg", {
                name: message.author.username,
                message: message.content,
            });
        });

        client.on(Events.Error, console.log);

        client.login(token);
    });
