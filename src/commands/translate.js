
const { SlashCommandBuilder } = require('discord.js');
const cloudflareAI = require('../services/cloudflareAI');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Dịch văn bản bằng AI')
        .addStringOption(option =>
            option
                .setName('text')
                .setDescription('Văn bản cần dịch')
                .setRequired(true)
                .setMaxLength(2000)
        )
        .addStringOption(option =>
            option
                .setName('language')
                .setDescription('Ngôn ngữ muốn dịch sang')
                .setRequired(true)
                .addChoices(
                    { name: 'Tiếng Việt', value: 'Vietnamese' },
                    { name: 'English', value: 'English' },
                    { name: 'Japanese', value: 'Japanese' },
                    { name: 'Korean', value: 'Korean' },
                    { name: 'Chinese', value: 'Chinese' }
                )
        ),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        const language = interaction.options.getString('language');

        await interaction.deferReply();

        try {
            const answer = await cloudflareAI.chat([
                {
                    role: 'system',
                    content: `Bạn là công cụ dịch thuật. Hãy dịch văn bản sang ${language}. Chỉ trả về bản dịch, không giải thích thêm.`
                },
                {
                    role: 'user',
                    content: text
                }
            ]);

            await interaction.editReply(answer.slice(0, 2000));

        } catch (error) {
            console.error('Translate command error:', error);

            await interaction.editReply(
                'Không thể dịch văn bản lúc này. Vui lòng thử lại sau.'
            );
        }
    }
};
