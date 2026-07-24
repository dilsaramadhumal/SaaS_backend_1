require('dotenv').config();
require("./jobs/cleanup.jobs.js")

const app = require('./app');
const sequelize = require('./config/db');
require('./models');

( async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log('Database connectd and synced');

        const server = app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log('\n${signal} recieved. Shutting down gracefulyl...');

            server.close(async () => {
                try{
                    await sequelize.close();

                    console.log('Database connection closed.');
                    console.log('Server shutdown successfully.');

                    process.exit(0);
                } catch (err) {
                    console.error("Error during shutdown: ", err);
                    process.exit(1);
                }
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));

    } catch (error) {
        console.error(error);
        process.exit(1);
    }

})();