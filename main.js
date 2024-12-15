const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Command prefix
const PREFIX = '!';

// Bot login to Discord
client.login('YOUR_TOKEN_HERE');

client.on('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

// Message event handler
client.on('messageCreate', async (message) => {
    // Ignore messages from the bot itself or those that don't start with the prefix
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    // Extract command and arguments
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'check') {
        // Check if a username was provided
        if (!args.length) {
            return message.reply('Please specify a username, e.g., `!check DanaBZH`.');
        }

        const username = args[0]; // The specified username

        try {
            // Dynamic import of node-fetch
            const fetch = await import('node-fetch');

            // API call
            const response = await fetch.default(`https://api.worldguessr.com/api/eloRank?username=${username}`);

            if (!response.ok) {
                throw new Error('Unable to retrieve data for this user.');
            }

            const data = await response.json();

            // Build the response message
            const embedMessage = {
                color: parseInt(data.league.color.replace('#', ''), 16), // Convert hexadecimal color to integer
                title: `Statistics for ${username}`,
                description: `Here is the retrieved information:`,
                fields: [
                    { name: 'Elo', value: data.elo.toString(), inline: true },
                    { name: 'Rank', value: `#${data.rank}`, inline: true },
                    { name: 'League', value: `${data.league.name} ${data.league.emoji}`, inline: true },
                    { name: 'Duels Won', value: data.duels_wins.toString(), inline: true },
                    { name: 'Duels Lost', value: data.duels_losses.toString(), inline: true },
                    { name: 'Duels Tied', value: data.duels_tied.toString(), inline: true },
                    { name: 'Win Rate', value: `${(data.win_rate * 100).toFixed(2)}%`, inline: true },
                ],
                footer: {
                    text: 'Data retrieved from WorldGuessr API'
                }
            };

            // Send the message to the Discord channel
            message.channel.send({ embeds: [embedMessage] });

        } catch (error) {
            console.error('Error during API call:', error);
            message.reply('An error occurred while retrieving the data.');
        }
    }
});




