const fs = require('node:fs');
const path = require('node:path');

module.exports = function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');

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

        client.commands.set(command.data.name, command);

        console.log(`Loaded command: ${command.data.name}`);

        console.log('[COMMAND] Loading:', file);
    }
};
