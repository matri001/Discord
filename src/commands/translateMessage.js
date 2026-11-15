
const {
    ContextMenuCommandBuilder,
    ApplicationCommandType
} = require('discord.js');

const cloudflareAI = require('../services/cloudflareAI');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Translate to Vietnamese')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        // Lấy tin nhắn mà người dùng vừa chọn
        const targetMessage = interaction.targetMessage;

        const text = targetMessage.content;

        if (!text || !text.trim()) {
            return interaction.reply({
                content: 'Tin nhắn này không có nội dung văn bản để dịch.',
                ephemeral: true
            });
        }

        // Báo Discord rằng bot đang xử lý
        await interaction.deferReply({
            ephemeral: true
        });

        try {
            const answer = await cloudflareAI.chat([
                {
                    role: 'system',
                    content: `
                        Bạn là công cụ dịch thuật.
                        Hãy dịch nội dung sang tiếng Việt.
                        Giữ nguyên ý nghĩa và sắc thái của câu gốc.
                        Chỉ trả về bản dịch, không giải thích.
                    `
                },
                {
                    role: 'user',
                    content: text
                }
            ]);

            await interaction.editReply({
                content: `**Bản dịch tiếng Việt:**\n${answer.slice(0, 1900)}`
            });

        } catch (error) {
            console.error('Translate message error:', error);

            await interaction.editReply(
                'Không thể dịch tin nhắn lúc này. Vui lòng thử lại sau.'
            );
        }
    }
};
