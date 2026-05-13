const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const authRoutes = require('./routes/auth.routes');
const passwordRoutes = require("./routes/password.routes");
const csrfProtection = require('./middleware/csrf.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
);
app.use(compression());
app.use(csrfProtection);
app.use('/api/auth', authRoutes);
app.use("/api/password", passwordRoutes);
app.use(errorHandler);

app.set('trust proxy', 1);

//---------------------------------------
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken});
});
//----------------------------------------

module.exports = app;