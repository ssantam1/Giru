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
        const challenger = interaction.user;
        const opponent = interaction.options.getUser('opponent');

        if (opponent.bot) {
            return interaction.reply({ content: 'You can\'t play against a bot!', ephemeral: true });
        }

        if (opponent.id === challenger.id) {
            return interaction.reply({ content: 'You can\'t play against yourself!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Rock-Paper-Scissors')
            .setDescription('Waiting for both players to choose...');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rock')
                    .setLabel('Rock')
                    .setStyle('Primary')
                    .setEmoji('🪨'),
                new ButtonBuilder()
                    .setCustomId('paper')
                    .setLabel('Paper')
                    .setStyle('Primary')
                    .setEmoji('📄'),
                new ButtonBuilder()
                    .setCustomId('scissors')
                    .setLabel('Scissors')
                    .setStyle('Primary')
                    .setEmoji('✂️')
            );

        const message = await interaction.reply({
            content: `<@${challenger.id}> challenged <@${opponent.id}> to Rock-Paper-Scissors!`,
            embeds: [embed],
            components: [row],
            fetchReply: true
        });
        
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60_000 });
        
        const playerChoices = {};

        collector.on('collect', async i => {
            if (i.user.id !== challenger.id && i.user.id !== opponent.id) {
                return i.reply({ content: 'You are not part of this game!', ephemeral: true });
            }

            if (playerChoices[i.user.id]) {
                return i.reply({ content: 'You have already made a choice!', ephemeral: true });
            }

            playerChoices[i.user.id] = i.customId;

            if (playerChoices[challenger.id] && playerChoices[opponent.id]) {
                collector.stop();
                await i.deferUpdate();
            } else {
                let tag = i.user.id === challenger.id ? opponent.tag : challenger.tag;
                await i.update({ embeds: [embed.setDescription(`Waiting for ${tag} to choose...`)] });
            }
        });

        collector.on('end', collected => {
            const challengerSumbission = collected.find(i => i.user.id === challenger.id);
            const opponentSubmission = collected.find(i => i.user.id === opponent.id);

            if (!challengerSumbission || !opponentSubmission) {
                embed.setDescription('Game Cancelled:\nOne or more players did not make a choice in time.');
                return interaction.editReply({ embeds: [embed], components: [] });
            }

            const challengerChoice = challengerSumbission.customId;
            const opponentChoice = opponentSubmission.customId;

            let result;
            if (challengerChoice === opponentChoice) {
                result = 'It\'s a tie!';
            } else if (
                (challengerChoice === 'rock' && opponentChoice === 'scissors') ||
                (challengerChoice === 'paper' && opponentChoice === 'rock') ||
                (challengerChoice === 'scissors' && opponentChoice === 'paper')
            ) {
                result = `${challenger.tag} wins!`;
                embed.setThumbnail(challenger.displayAvatarURL());
            } else {
                result = `${opponent.tag} wins!`;
                embed.setThumbnail(opponent.displayAvatarURL());
            }
        
            embed.setDescription(`${challenger.tag} chose ${challengerChoice}\n${opponent.tag} chose ${opponentChoice}\n\n${result}`);
            interaction.editReply({ embeds: [embed], components: [] });
        });
    }
}