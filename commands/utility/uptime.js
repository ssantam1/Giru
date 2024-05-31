const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Provides the uptime of the bot.'),

    async execute(interaction) {
        const uptime = interaction.client.minutes
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;

        await interaction.reply(`Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`);
    },
}