require('dotenv').config({ path: '.env.local' });

const sslConfig = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ...sslConfig,
    },
  },
};