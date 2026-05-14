const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define(
    'Product',
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

        description: {
            type: DataTypes.TEXT
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'products',
        timestamps: true,
        indexes: [
            { fields: ['ownerId'] }
        ]
    }
);

module.exports = Product;