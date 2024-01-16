import "dotenv/config";
import { createDiscordBot } from "./discordBot.js";
import { createMinecraftBot } from "./minecraftBot.js";
import { Colors, EmbedBuilder } from "discord.js";
import { getAvatar } from "./skinFetcher.js";

const channelId = process.env.CHANNEL_ID;

const [client, bot] = await Promise.all([
    createDiscordBot(),
    createMinecraftBot(),
]);

const channel = client.channels.cache.get(channelId);
channel.send;

client.on("guild_msg", async ({ name, message }) => {
    bot.chat(`/gc ${name}: ${message}`);
});

bot.on("guild_msg", async ({ name, message, rank, guild_rank }) => {
    const file = await getAvatar(name);
    const embed = new EmbedBuilder()
        .setAuthor({ name, iconURL: "attachment://avatar.png" })
        .setDescription(message)
        .setFooter({ text: guild_rank ?? "N/A" })
        .setColor(Colors.Blue)
        .setTimestamp();
    channel.send({
        embeds: [embed],
        files: [{ attachment: file, name: "avatar.png" }],
    });
});

bot.on("guild_join", async ({ name }) => {
    const file = await getAvatar(name);
    const embed = new EmbedBuilder()
        .setAuthor({
            name: name + " joined.",
            iconURL: "attachment://avatar.png",
        })
        .setColor(Colors.Green)
        .setTimestamp();
    channel.send({
        embeds: [embed],
        files: [{ attachment: file, name: "avatar.png" }],
    });
});

bot.on("guild_leave", async ({ name }) => {
    const file = await getAvatar(name);
    const embed = new EmbedBuilder()
        .setAuthor({
            name: name + " left.",
            iconURL: "attachment://avatar.png",
        })
        .setColor(Colors.Red)
        .setTimestamp();
    channel.send({
        embeds: [embed],
        files: [{ attachment: file, name: "avatar.png" }],
    });
});
