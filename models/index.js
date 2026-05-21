const User = require('./user.model');
const Session = require('./session.model');
const Product = require('./product.model');

User.hasMany(Session, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Session.belongsTo(User, {
    foreignKey: 'userId'
});

User.hasMany(Product, {
    foreigKey: 'ownerId',
    onDelete: 'CASCADE'
});

Product.belongsTo(User, {
    foreignKey: 'ownerId'
});

module.exports = {
    User,
    Session,
    Product
};