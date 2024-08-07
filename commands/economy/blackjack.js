const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { getBalance, addBalance } = require('../../dbObjects.js');

async function isValidBet(user, bet){
    const balance = await getBalance(user.id);
    return balance >= bet && bet > 0;
}

class Card {
    constructor(value, suit){
        this.value = value;
        this.suit = suit;
    }

    get symbol() {
        if(this.value <= 10) return this.value.toString();
        return ['J', 'Q', 'K', 'A'][this.value - 11];
    }

    toString() {
        return `[${this.symbol}${this.suit}]`;
    }
}

class Deck {
    constructor(){
        this.cards = [];
        this.reset();
    }

    reset(){
        this.cards = [];
        for(let i = 0; i < 4; i++){
            for(let j = 2; j <= 14; j++){
                this.cards.push(new Card(j, ['♠', '♣', '♥', '♦'][i]));
            }
        }
    }

    shuffle(){
        for(let i = this.cards.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(){
        return this.cards.pop();
    }
}

class Hand {
    constructor(deck){
        this.cards = [];
        this.deck = deck;
        this.hit();
        this.hit();
    }

    hit(){
        this.cards.push(this.deck.draw());
    }

    get value(){
        let value = 0;
        let aces = 0;
        for(const card of this.cards){
            if(card.value === 14){
                aces++;
                value += 11;
            }
            value += Math.min(card.value, 10);
        }
        while(value > 21 && aces > 0){
            value -= 10;
            aces -= 1;
        }
        return value;
    }

    get isBusted(){
        return this.value > 21;
    }

    get isBlackjack(){
        return this.value === 21 && this.cards.length === 2;
    }

    toString(){
        return this.cards.join(' ') + `\nTotal: ${this.value}`;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack!')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('The amount of credits you want to bet')
                .setRequired(true)),

    async execute(interaction) {
        const bet = interaction.options.getInteger('bet');

        // Check if the bet is valid
        if(!isValidBet(interaction.user, bet)){
            return interaction.reply({ content: 'Invalid bet amount! You need more credits!', ephemeral: true });
        }
        
        // Create a new deck and shuffle it
        const deck = new Deck().shuffle();
        
        // Create hands for the player and dealer
        const playerHand = new Hand(deck);
        const dealerHand = new Hand(deck);

        // Construct the embed
        const embed = new EmbedBuilder()
            .setColor('WHITE')
            .setTitle(`${interaction.user.username}'s Blackjack Game`)
            .setDescription(`You bet ${bet} credits!`)
            .addFields(
                { name: 'Your Hand', value: playerHand.toString(), inline: true },
                { name: 'Dealer Hand', value: dealerHand.toString(), inline: true }
            );

        // Send the embed
        await interaction.reply({ embeds: [embed] });
    }
}