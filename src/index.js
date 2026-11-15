
require('dotenv').config();

const {
    Client,
    Collection,
    GatewayIntentBits
} = require('discord.js');

const loadCommands = require('./handlers/commandHandler');
const loadEvents = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// Collection lưu các command
client.commands = new Collection();

// Load commands và events

loadCommands(client);

loadEvents(client);


// Login Discord
client.login(process.env.DISCORD_TOKEN);
