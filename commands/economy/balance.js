const { SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows your current balance.'),
    async execute(interaction) {
        console.log(`User ${interaction.user.tag} issued /balance (${interaction.channel.name})`);
        
        const balance = await getBalance(interaction.user.id);

        console.log(`User ${interaction.user.tag} has ${balance} credits.`);
        await interaction.reply(`Your current balance is ${balance} credits.`);
    },
};
