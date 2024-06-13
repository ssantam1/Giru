const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { getBalance, addBalance } = require('../dbObjects.js');

async function isValidBet(user, bet){
    const balance = await getBalance(user.id);
    return balance >= bet && bet > 0;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack!')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('The amount of credits you want to bet')
                .setRequired(true)),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Blackjack');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}