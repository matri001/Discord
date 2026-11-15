
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Kiểm tra command có data hay không
    if (!command.data) {
        console.error(`Invalid command file: ${file}`);
        continue;
    }

    if (typeof command.data.toJSON !== 'function') {
        console.error(`Invalid SlashCommandBuilder: ${file}`);
        continue;
    }

    commands.push(command.data.toJSON());

    console.log(`Loaded command: ${command.data.name}`);
}


const rest = new REST({ version: '10' })
    .setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully registered commands!');
    } catch (error) {
        console.error(error);
    }
}

deployCommands();
