
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency'),

    async execute(interaction) {
        console.log('[COMMAND] Executing ping');
        console.log('[USER]', interaction.user.tag);
        await interaction.reply('Pong! 🏓');
    }
};
