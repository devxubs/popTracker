const { Sequelize } = require("sequelize");

/**
 * Sequelize instance connected to TiDB (MySQL-wire-compatible).
 *
 * TiDB Cloud Serverless requires TLS on its public endpoint. Node's built-in
 * Mozilla CA bundle is already trusted by TiDB Serverless, so no CA file is
 * needed — just enable SSL via TIDB_ENABLE_SSL=true in .env.
 *
 * For local/self-hosted TiDB (e.g. via TiUP playground) or a local MySQL
 * instance, leave TIDB_ENABLE_SSL unset/false and SSL is skipped entirely.
 */
const useSSL = process.env.TIDB_ENABLE_SSL === "true";

const sequelize = new Sequelize(
   process.env.DB_NAME,
   process.env.DB_USER,
   process.env.DB_PASSWORD,
   {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 4000, // TiDB Cloud default port is 4000 (MySQL default is 3306)
      dialect: "mysql",
      dialectOptions: useSSL
         ? {
              ssl: {
                 minVersion: "TLSv1.2",
                 rejectUnauthorized: true,
              },
           }
         : {},
      logging: false, // set to console.log to see generated SQL while debugging
   },
);

/**
 * Verifies the connection and syncs models to the database.
 * `alter: true` lets Sequelize adjust existing tables to match the models
 * during development. Use proper migrations instead of `sync` in production.
 */
const connectDB = async () => {
   try {
      await sequelize.authenticate();
      console.log(
         `Connected to TiDB at ${process.env.DB_HOST}:${process.env.DB_PORT || 4000}`,
      );

      await sequelize.sync({ alter: true });
      console.log("Database tables synced");
   } catch (error) {
      console.error(`Database Connection Error: ${error.message}`);
      process.exit(1);
   }
};

module.exports = { sequelize, connectDB };
