require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = process.env.API_URL;

if (!BOT_TOKEN || !API_URL) {
    throw new Error("BOT_TOKEN or API_URL is missing! Please check your .env file.");
}

const bot = new Telegraf(BOT_TOKEN);

const COOLDOWN_SECONDS = 20;
const userCooldowns = new Map();
const userStates = new Map();


bot.start((ctx) => {
    ctx.reply("Enter actor name or ID.");
});


async function sendNextBatch(ctx, userId) {
    const state = userStates.get(userId);
    if (!state || !state.results) return;

    const results = state.results;
    const startIdx = state.index;
    const endIdx = startIdx + 5;
    const batch = results.slice(startIdx, endIdx);

    if (batch.length === 0) {
        ctx.reply("✅ No more results.");
        userStates.delete(userId);
        return;
    }

    for (const [title, cleanLink] of batch) {
        const keyboard = Markup.inlineKeyboard([
            Markup.button.url("Watch Now ▷", cleanLink)
        ]);
        await ctx.reply(`📌 *${title}*`, { parse_mode: 'Markdown', ...keyboard });
    }

    state.index = endIdx;

    if (state.index < results.length) {
        state.awaitingYn = true;
        ctx.reply("Fetch 5 more ? (Y/N)");
    } else {
        ctx.reply("✅ No more results.");
        userStates.delete(userId);
    }
}


bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userInput = ctx.message.text.trim();

    if (!userInput) return;

    
    const state = userStates.get(userId);
    if (state && state.awaitingYn) {
        const answer = userInput.toUpperCase();
        if (answer === "Y") {
            state.awaitingYn = false;
            state.yCount += 1;

            if (state.yCount >= 2) {
                const waitNotice = await ctx.reply("⏳ Waiting 30s for 5 more...");
                await new Promise(resolve => setTimeout(resolve, 30000));
                try {
                    await ctx.telegram.deleteMessage(ctx.chat.id, waitNotice.message_id);
                } catch (e) {}
            }

            await sendNextBatch(ctx, userId);
            return;
        } else if (answer === "N") {
            ctx.reply("🛑 Search cancelled");
            userStates.delete(userId);
            return;
        } else {
            ctx.reply("Enter 'Y' or 'N' only.");
            return;
        }
    }

   
    const currentTime = Date.now() / 1000;
    if (userCooldowns.has(userId)) {
        const elapsedTime = currentTime - userCooldowns.get(userId);
        if (elapsedTime < COOLDOWN_SECONDS) {
            const remainingTime = Math.ceil(COOLDOWN_SECONDS - elapsedTime);
            const waitMsg = await ctx.reply(`⏳ Please wait ${remainingTime} seconds...`);
            await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));
            try {
                await ctx.telegram.deleteMessage(ctx.chat.id, waitMsg.message_id);
            } catch (e) {}
        }
    }

    const statusMsg = await ctx.reply("🔎 Searching...");
    const targetApiUrl = `${API_URL}${userInput}`;

    try {
        const response = await axios.get(targetApiUrl, { timeout: 15000 });

        if (response.status !== 200) {
            await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, "❌ API connection failed.");
            return;
        }

        const data = response.data;
        const listItems = data.list || [];

        if (listItems.length === 0) {
            await ctx.telegram.editMessageText(
                ctx.chat.id,
                statusMsg.message_id,
                undefined,
                "⚠️ No information found. Please recheck the correct code."
            );
            return;
        }

        const extractedLinks = [];
        for (const item of listItems) {
            const title = item.name || item.origin_name || "No Title";
            const episodes = item.episodes || {};
            const serverData = episodes.server_data || {};
            const fullData = serverData.Full || {};
            const rawEmbedLink = fullData.link_embed || "";

            if (rawEmbedLink) {
                const cleanLink = rawEmbedLink.replace(/\\\//g, "/");
                extractedLinks.push([title, cleanLink]);
            }
        }

        userCooldowns.set(userId, Date.now() / 1000);

        if (extractedLinks.length === 0) {
            await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, "⚠️ `link_embed` No results found.");
            return;
        }

        await ctx.telegram.deleteMessage(ctx.chat.id, statusMsg.message_id);

        userStates.set(userId, {
            results: extractedLinks,
            index: 5,
            awaitingYn: false,
            yCount: 0
        });

        const firstBatch = extractedLinks.slice(0, 5);

        for (const [title, cleanLink] of firstBatch) {
            const keyboard = Markup.inlineKeyboard([
                Markup.button.url("Watch Now ▷", cleanLink)
            ]);
            await ctx.reply(`📌 *${title}*`, { parse_mode: 'Markdown', ...keyboard });
        }

        if (extractedLinks.length > 5) {
            const currentState = userStates.get(userId);
            if (currentState) currentState.awaitingYn = true;
            await ctx.reply("Fetch 5 more ? (Y/N)");
        }

    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        try {
            await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, undefined, `❌ An error has occurred: ${error.message}`);
        } catch (e) {
            await ctx.reply(`❌ An error has occurred: ${error.message}`);
        }
    }
});


bot.launch().then(() => {
    console.log("Bot is running...");
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
