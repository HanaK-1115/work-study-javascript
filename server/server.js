const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const paidLeaveRoutes = require('./routes/paidLeaveRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/paid-leave', paidLeaveRoutes);

// モデルのインポート
const User = require('./models/User');
const PaidLeaveManagement = require('./models/PaidLeaveManagement');
const PaidLeaveApplication = require('./models/PaidLeaveApplication');

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    // 証明書ファイルのパス
    const options = {
      key: fs.readFileSync('./certs/server.key'), // 秘密鍵
      cert: fs.readFileSync('./certs/server.cert'), // 証明書
    };

    // HTTPS サーバーの作成
    https.createServer(options, app).listen(port, () => {
      console.log(`HTTPS Server running on port ${port}`);
    });
  })
  .catch(err => console.log('Database connection or sync error:', err));

// 定期実行処理読み込み
require('./cron/cronTasks');
