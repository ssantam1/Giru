const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionRemove,

    async execute(reaction, user) {
        console.log(`${user.tag} removed their "${reaction.emoji.name}" reaction from a message.`);
    },
};