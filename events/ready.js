const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await client.Tags.sync();
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};