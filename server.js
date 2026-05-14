require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db');
require('./models');

( async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log('Database connectd and synced');

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });

    } catch (error) {
        console.error(error);
    }

})();