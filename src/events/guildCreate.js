
const guildService = require('../services/guildService');

module.exports = {
    name: 'guildCreate',

    async execute(guild) {
        try {
            await guildService.ensureGuild(guild);

            console.log(
                `[Guild] Registered: ${guild.name} (${guild.id})`
            );
        } catch (error) {
            console.error('[Guild] Registration failed:', error);
        }
    }
};
