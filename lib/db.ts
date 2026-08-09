import { Sequelize } from "sequelize";

declare global {
  // eslint-disable-next-line no-var
  var sequelize: Sequelize | undefined;
}

let sequelize: Sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL as string);
} else {
  if (!global.sequelize) {
    global.sequelize = new Sequelize(process.env.DATABASE_URL as string);
  }
  sequelize = global.sequelize;
}

export default sequelize;