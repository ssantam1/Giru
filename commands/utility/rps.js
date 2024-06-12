const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

const emojis = {
    'rock': '🪨',
    'paper': '📄',
    'scissors': '✂️'
};

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

        console.log(`User ${interaction.user.tag} issued /rps ${opponent.tag} (${interaction.channel.name})`);

        if (opponent.bot) {
            return interaction.reply({ content: 'You can\'t play against a bot!', ephemeral: true });
        }

        //if (opponent.id === challenger.id) {
        //    return interaction.reply({ content: 'Please don\'t play with yourself...', ephemeral: true });
        //}

        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('__Rock-Paper-Scissors__')
            .addFields(
                { name: challenger.tag + ':', value: 'Choosing...', inline: true },
                { name: opponent.tag + ':', value: 'Choosing...', inline: true }
            )
            .setDescription('Waiting for both players to select their move...');

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
                const field = embed.data.fields.find(f => f.name === i.user.tag + ':');
                field.value = 'Ready!';
                await i.update({ embeds: [embed] });
            }
        });

        collector.on('end', collected => {
            const challengerSumbission = collected.find(i => i.user.id === challenger.id);
            const opponentSubmission = collected.find(i => i.user.id === opponent.id);

            if (!challengerSumbission || !opponentSubmission) {
                embed.setDescription('🚫 Game Cancelled: Player(s) did not choose in time.')
                    .setFooter({ iconURL: interaction.client.user.displayAvatarURL(), text: 'Game Cancelled' })
                    .setTimestamp();
                return interaction.editReply({ embeds: [embed], components: [] });
            }

            const challengerChoice = challengerSumbission.customId;
            const opponentChoice = opponentSubmission.customId;

            embed.data.fields[0].value = emojis[challengerChoice] + ' ' + challengerChoice.charAt(0).toUpperCase() + challengerChoice.slice(1);
            embed.data.fields[1].value = emojis[opponentChoice] + ' ' + opponentChoice.charAt(0).toUpperCase() + opponentChoice.slice(1);

            let result;
            if (challengerChoice === opponentChoice) {
                result = 'It\'s a tie!';
                resultEmoji = '⚖️ ';
            } else if (
                (challengerChoice === 'rock' && opponentChoice === 'scissors') ||
                (challengerChoice === 'paper' && opponentChoice === 'rock') ||
                (challengerChoice === 'scissors' && opponentChoice === 'paper')
            ) {
                result = `${challenger.tag} wins!`;
                resultEmoji = '🏆 ';
                embed.setThumbnail(challenger.displayAvatarURL());
            } else {
                result = `${opponent.tag} wins!`;
                resultEmoji = '🏆 ';
                embed.setThumbnail(opponent.displayAvatarURL());
            }
        
            embed.setDescription(resultEmoji + result)
                .setFooter({ iconURL: interaction.client.user.displayAvatarURL(), text: result })
                .setTimestamp();

            interaction.editReply({ embeds: [embed], components: [] });
        });
    }
}