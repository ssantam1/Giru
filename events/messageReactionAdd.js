const { Events } = require('discord.js');

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

        console.log(`${user.tag} reacted with "${reaction.emoji.name}" on a message.`);
    },
};