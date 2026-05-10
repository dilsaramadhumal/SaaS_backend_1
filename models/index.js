const User = require('./user.model');
const Session = require('./session.model');

User.hasMany(Session, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});

Session.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = {
    User,
    Session
};