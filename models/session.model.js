const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define(
    "Session",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        refreshTokenHash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        deviceInfo: {
            type: DataTypes.STRING,
            allowNull: true
        },

        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        absoluteExpiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        isRevoked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'sessions',
        timestamps: true,
        indexes: [
            {
                fields: ["userId"]
            },
            {
                fields: ['expiresAt']
            }
        ]
    }
);

module.exports = Session;