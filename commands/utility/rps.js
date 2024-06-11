const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports ={
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play a game of rock-paper-scissors.')
        .addUserOption(option =>
            option.setName('opponent')
                .setDescription('The user to play against.')
                .setRequired(true)),

    async execute(interaction) {
        // Send an embed displaying game status
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Rock-Paper-Scissors')
            .setDescription('Waiting for both players to choose...');

        const rock = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('Rock')
            .setStyle(1);
        
        const paper = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('Paper')
            .setStyle(1);

        const scissors = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('Scissors')
            .setStyle(1);

        const row = new ActionRowBuilder()
            .addComponents(rock, paper, scissors);

        const game = await interaction.reply({
            content: `<@${interaction.user.id}> challenged <@${interaction.options.getUser('opponent').id}> to Rock-Paper-Scissors!`,
            embeds: [embed],
            components: [row] });

        const playerFilter = i => i.user.id === interaction.user.id || i.user.id === interaction.options.getUser('opponent').id;
        
        const collector = game.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: playerFilter,
            time: 60_000 });
        
        let responsesRecieved = 0;

        collector.on('collect', async i => {
            responsesRecieved++;
            if (responsesRecieved === 2) {
                collector.stop();
                await i.deferUpdate();
            } else {
                if (i.user.id === interaction.user.id) {
                    await i.update({ embeds: [embed.setDescription(`Waiting for ${interaction.options.getUser('opponent').tag} to choose...`)] });
                } else {
                    await i.update({ embeds: [embed.setDescription(`Waiting for ${interaction.user.tag} to choose...`)] });
                }
            }
        });

        collector.on('end', collected => {
            const player1 = collected.find(i => i.user.id === interaction.user.id);
            const player2 = collected.find(i => i.user.id === interaction.options.getUser('opponent').id);

            if (!player1 || !player2) {
                embed.setDescription('Game Cancelled:\nOne or more players did not make a choice in time.');
                return interaction.editReply({ embeds: [embed], components: [] });
            }

            const player1Choice = player1.customId;
            const player2Choice = player2.customId;

            let result;
            if (player1Choice === player2Choice) {
                result = 'It\'s a tie!';
            } else if (
                (player1Choice === 'rock' && player2Choice === 'scissors') ||
                (player1Choice === 'paper' && player2Choice === 'rock') ||
                (player1Choice === 'scissors' && player2Choice === 'paper')
            ) {
                result = `${interaction.user.tag} wins!`;
            } else {
                result = `${interaction.options.getUser('opponent').tag} wins!`;
            }

            embed.setDescription(`${interaction.user.tag} chose ${player1Choice}\n${interaction.options.getUser('opponent').tag} chose ${player2Choice}\n\n${result}`);
            interaction.editReply({ embeds: [embed], components: [] });
        });
    }
}