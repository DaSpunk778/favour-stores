import { Sequelize } from "sequelize";

declare global {
  // eslint-disable-next-line no-var
  var sequelize: Sequelize | undefined;
}

let sequelize: Sequelize;

const options = {
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