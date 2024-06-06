const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtag')
		.setDescription('Add a new tag to test database.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the tag.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the tag.')
                .setRequired(true)),

	async execute(interaction) {
        const tagName = interaction.options.getString('name');
        const tagDescription = interaction.options.getString('description');

        try {
            const tag = await interaction.client.Tags.create({
                name: tagName,
                description: tagDescription,
                username: interaction.user.username,
            });

            return interaction.reply(`Tag ${tag.name} added.`);
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply('That tag already exists.');
            }

            console.error(error);
            return interaction.reply('There was an error while adding a tag.');
        }
	},
};
