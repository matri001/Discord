
const { SlashCommandBuilder } = require('discord.js');
const cloudflareAI = require('../services/cloudflareAI');
const guildConfigService = require('../services/guildConfigService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Hỏi AI CommunityMate')
        .addStringOption(option =>
            option
                .setName('question')
                .setDescription('Câu hỏi bạn muốn đặt')
                .setRequired(true)
                .setMaxLength(2000)
        ),

    async execute(interaction) {
        const question = interaction.options.getString('question');

        // Báo Discord rằng bot đang xử lý
        await interaction.deferReply();

        try {
            if (!interaction.guild) {
                await interaction.editReply(
                    'Lệnh này chỉ có thể dùng trong một server Discord.'
                );
                return;
            }

            const aiEnabled = await guildConfigService.isAIEnabled(
                interaction.guild.id
            );

            if (!aiEnabled) {
                await interaction.editReply(
                    'AI hiện đang bị tắt trên server này.'
                );
                return;
            }

            const answer = await cloudflareAI.chat([
                {
                    role: 'system',
                    content: `
                        Bạn là CommunityMate AI, trợ lý của cộng đồng Discord.

                        Nhiệm vụ:
                        - Trả lời bằng tiếng Việt.
                        - Giải thích rõ ràng, dễ hiểu.
                        - Ưu tiên câu trả lời ngắn gọn, trực tiếp.
                        - Sử dụng ví dụ khi cần thiết.
                        - Không trình bày quá dài nếu người dùng không yêu cầu.
                        - Chỉ cung cấp câu trả lời cuối cùng.
                    `
                },
                {
                    role: 'user',
                    content: question
                }
            ]);

            await interaction.editReply(answer.slice(0, 2000));

        } catch (error) {
            console.error('Ask command error:', error);

            if (error.name === 'TimeoutError') 
            {
                await interaction.editReply('AI đang xử lý quá lâu. Bạn vui lòng thử lại sau nhé!');
                return;
            }
            await interaction.editReply('Xin lỗi, AI hiện không thể trả lời. Vui lòng thử lại sau.');
        }
    }
};
