
require('dotenv').config();

const sequelize = require('./config/database');
const guildConfigService = require('./services/guildConfigService');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected!');

        const discordGuildId = '596550753028669461';

        const config = await guildConfigService.getConfig(
            discordGuildId
        );

        console.log('Current config:', config.toJSON());

        const enabled = await guildConfigService.isAIEnabled(
            discordGuildId
        );

        console.log('AI enabled:', enabled);

        const updated = await guildConfigService.updateConfig(
            discordGuildId,
            { language: 'en' }
        );

        console.log('Updated config:', updated.toJSON());

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await sequelize.close();
    }
}

test();
