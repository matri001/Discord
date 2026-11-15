
module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        // Chỉ xử lý Slash Command và Message Context Menu
        if (!interaction.isChatInputCommand() &&!interaction.isMessageContextMenuCommand()) {
            return;
        }

        // Lấy Discord Client từ interaction
        const client = interaction.client;

        // Tìm command trong Collection
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`Command not found: ${interaction.commandName}`);
            return;
        }
        try {
            // Thực thi command
            await command.execute(interaction, client);
            if (interaction.guild && interaction.user) {
                const guildService = require('../services/guildService');

                await guildService.ensureGuildMember(
                 interaction.guild,
                 interaction.user,
                 interaction.member?.joinedAt ?? null
        );
    }
        } catch (error) {
            console.error('Interaction error:', error);

            const reply = {
                content: 'Đã xảy ra lỗi khi thực hiện lệnh.',
                ephemeral: true
            };

            // Kiểm tra interaction đã phản hồi hay chưa
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    }
};
