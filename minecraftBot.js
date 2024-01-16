import "dotenv/config";
import mineflayer from "mineflayer";

const serverIp = process.env.SERVER_IP;
const serverPort = process.env.SERVER_PORT;
const username = process.env.NAME;

/**
 *
 * @returns {Promise<mineflayer.Bot>}
 */
export const createMinecraftBot = () =>
    new Promise((res, rej) => {
        const bot = mineflayer.createBot({
            host: serverIp,
            port: serverPort,
            username: username,
            auth: "offline",
        });

        /**
         * @returns {RegExpMatchArray | false}
         */
        const checkRegex = (regex, msg, nameIndex) => {
            const output = msg.match(regex);
            if (output === null) return false;
            if (output[nameIndex] === bot.username) return false;
            return output;
        };

        const onMessage = (msg) => {
            const output = checkRegex(
                /^Guild > (?:\[(.{1,10})\] )?(\S{3,16})(?: \[(.{1,10})\])?: (.+)$/,
                msg,
                2
            );
            if (!output) return false;
            const [full, rank, name, guild_rank, message] = output;
            if (name === bot.username) return;
            console.log(`Minecraft - ${name}: ${message}`);
            bot.emit("guild_msg", { name, message, rank, guild_rank });
            return true;
        };

        const onJoin = (msg) => {
            const output = checkRegex(/^Guild > (\S{3,16}) joined\.$/, msg, 1);
            if (!output) return false;
            const [full, name] = output;
            console.log(`Minecraft - ${name} joined`);
            bot.emit("guild_join", { name });
            return true;
        };

        const onLeave = (msg) => {
            const output = checkRegex(/^Guild > (\S{3,16}) left\.$/, msg, 1);
            if (!output) return false;
            const [full, name] = output;
            console.log(`Minecraft - ${name} left`);
            bot.emit("guild_leave", { name });
            return true;
        };

        bot.on("spawn", () => {
            console.log(`Ready! Minecraft username: ${username}`);
            res(bot);
        });

        bot.on("message", (jsonMsg) => {
            const msg = jsonMsg.toString();
            if (!msg.startsWith("Guild > ")) return;
            const foundOption = onJoin(msg) || onLeave(msg) || onMessage(msg);
            if (!foundOption) console.error("Invalid Message:", msg);
        });

        bot.on("kicked", (reason, loggedIn) => {
            console.log(reason, loggedIn);
        });
        bot.on("error", console.log);
    });
