const { SlashCommandBuilder } = require('discord.js');
const { Users } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows your current balance.'),
    async execute(interaction) {
        console.log(`User ${interaction.user.tag} issued /balance (${interaction.channel.name})`);
        let user = await Users.findOne({ where: { user_id: interaction.user.id } });

        if (!user) {
            console.log(`User ${interaction.user.tag} not found, creating a new user in database.`);
            user = await Users.create({ user_id: interaction.user.id, balance: 100 });
        }

        console.log(`User ${interaction.user.tag} has ${user.balance} credits.`);
        await interaction.reply(`Your current balance is ${user.balance} credits.`);
    },
};
