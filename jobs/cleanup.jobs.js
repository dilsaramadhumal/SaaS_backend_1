const cron = require('node-cron');
const { Op } = require('sequelize');
const { Session } = require('../models');

cron.schedule('0 * * * *', async () => {
    console.log('Running cleanup job for expired sessions');

    await  Session.destroy({
        where: { expiresAt: { [Op.lt]: new Date()}}
    });
});