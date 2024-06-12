const { Events } = require('discord.js');
const { addBalance } = require('../dbObjects.js');
const { updateScoreNickname } = require('../helpers.js');
const { upvoteEmojiId, downvoteEmojiId } = require('../config.json');

module.exports = {
    name: Events.MessageReactionAdd,

    async execute(reaction, user) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }

        if (reaction.message.author.id === user.id) {
            return;
        }

        const member = reaction.message.member || await reaction.message.guild.members.fetch(reaction.message.author.id);

        if (reaction.emoji.id === upvoteEmojiId) {
            const newBalance = await addBalance(reaction.message.author.id, 1);
            await updateScoreNickname(member, newBalance);
        }

        if (reaction.emoji.id === downvoteEmojiId) {
            const newBalance = await addBalance(reaction.message.author.id, -1);
            await updateScoreNickname(member, newBalance);
        }

        console.log(`${user.tag} reacted with "${reaction.emoji.name}" on a message.`);
    },
};