const express = require('express');
const app = express();
const port = 3000;
const dbUtil = require('./utils/db.util');
const authRoute = require('./routes/authentication.route');
const cors = require("cors");

app.use(express.json());
app.use(cors({
  origin: 'http://localhost'
}));

app.use('/authentication', authRoute);

(async () => {
    await dbUtil.connect();

    app.listen(port, (err) => {
        console.log(`Server is up and running at PORT ${port}`);
    });
})();