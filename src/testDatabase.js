
require('dotenv').config();

const {
    sequelize,
    Guild,
    GuildConfig,
    User,
    GuildMember
} = require('./models');

async function testDatabase() {
    try {
        await sequelize.authenticate();

        console.log('PostgreSQL connected!');

        await sequelize.sync();

        console.log('Database synchronized!');

        console.log('Created tables:', {
            Guild: Guild.tableName,
            GuildConfig: GuildConfig.tableName,
            User: User.tableName,
            GuildMember: GuildMember.tableName
        });

    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        await sequelize.close();
    }
}

testDatabase();
