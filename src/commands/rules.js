
const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Hiển thị nội quy của server'),

    async execute(interaction) {
        const rulesEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('📜 COMMUNITY RULES')
            .setDescription('Vui lòng đọc và tuân thủ các quy định sau:')
            .addFields(
                {
                    name: '1. Tôn trọng mọi người',
                    value: 'Không xúc phạm, công kích hoặc quấy rối thành viên khác.'
                },
                {
                    name: '2. Không spam',
                    value: 'Không gửi tin nhắn, emoji hoặc quảng cáo liên tục.'
                },
                {
                    name: '3. Không chia sẻ nội dung độc hại',
                    value: 'Không phát tán mã độc, link lừa đảo hoặc nội dung nguy hiểm.'
                },
                {
                    name: '4. Đúng kênh, đúng chủ đề',
                    value: 'Đăng nội dung vào đúng channel tương ứng.'
                },
                {
                    name: '5. Tuân thủ Discord Terms',
                    value: 'Tuân thủ Điều khoản dịch vụ và Community Guidelines của Discord.'
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [rulesEmbed]
        });
    }
};
