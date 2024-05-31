const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pfp')
        .setDescription('Provides the profile picture of a user. Defaults to command user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to display the profile picture of.')),

    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        const embed = new EmbedBuilder()
            .setColor('White')
            .setAuthor({name: `${user.tag}'s profile picture`, iconURL: user.displayAvatarURL()})
            .setImage(user.displayAvatarURL({ size: 1024 }));

        await interaction.reply({ embeds: [embed] });
    },
};