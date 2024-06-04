const { Events } = require('discord.js');

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

        console.log(`${user.tag} removed their "${reaction.emoji.name}" reaction from a message.`);
    },
};