const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageReactionAdd,

    async execute(reaction, user) {
        console.log(`${user.tag} reacted with "${reaction.emoji.name}" on a message.`);
    },
};