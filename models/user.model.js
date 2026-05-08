const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password:{
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },

        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },

        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }

    },
    {
        tableName: 'users',
        timestamps: true
    }
);

//hash before create
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

//hash before update
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

//compare password helper
User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = User;