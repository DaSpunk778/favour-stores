import { Sequelize } from "sequelize";
import pg from "pg";

declare global {
  // eslint-disable-next-line no-var
  var sequelize: Sequelize | undefined;
}

let sequelize: Sequelize;

const options = {
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};


if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL as string, options);
} else {
  if (!global.sequelize) {
    global.sequelize = new Sequelize(process.env.DATABASE_URL as string, options);
  }
  sequelize = global.sequelize;
}

export default sequelize;