const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');

connectDatabase()
  .then(() => app.listen(env.PORT, () => console.log(`API listening on port ${env.PORT}`)))
  .catch((error) => { console.error('Database connection failed', error); process.exit(1); });
