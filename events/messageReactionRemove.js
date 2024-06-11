const { Events } = require('discord.js');
const { addBalance } = require('../dbObjects.js');
const { upvoteEmojiId, downvoteEmojiId } = require('../config.json');

module.exports = {
    name: Events.MessageReactionRemove,

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

        if (reaction.emoji.id === upvoteEmojiId) {
            await addBalance(reaction.message.author.id, -1);
        }

        if (reaction.emoji.id === downvoteEmojiId) {
            await addBalance(reaction.message.author.id, 1);
        }

        console.log(`${user.tag} removed their "${reaction.emoji.name}" reaction from a message.`);
    },
};