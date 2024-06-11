const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Users = require('./models/users.js')(sequelize, Sequelize.DataTypes);

function addCurrency(userId, amount) {
    return Users.findOne({ where: { user_id: userId } }).then(user => {
        if (user) {
            user.currency += Number(amount);
            return user.save();
        }
        return Users.create({ user_id: userId, balance: amount });
    });
}

async function getBalance(userId) {
    const user = await Users.findOne({ where: { user_id: userId } });
    return user ? user.balance : 0;
}

module.exports = { Users, addCurrency, getBalance };