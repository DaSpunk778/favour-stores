import { DataTypes} from "sequelize";
import sequelize from "./db"

/* eslint-disable @typescript-eslint/no-require-imports */
const defineUser = require("../models/user");
const defineCategory = require("../models/category");
const defineOrder = require("../models/order");
const defineOrderItem = require("../models/orderItem");

export const User = defineUser(sequelize, DataTypes);
export const Category = defineCategory(sequelize, DataTypes);
export const Order = defineOrder(sequelize, DataTypes);
export const OrderItem = defineOrderItem(sequelize, DataTypes);

/* ---------------------------- Associations -------------------------------- *
 * Declared here (not inside each model's `associate()`) because this is the
 * file the running app imports, and it already owns the single shared sequelize
 * instance from lib/db.ts.
 *
 *   User  1───*  Order  1───*  OrderItem
 *
 * - A user has many orders; each order belongs to one user.
 * - An order has many items (aliased `items`); deleting an order deletes its
 *   items (ON DELETE CASCADE) so we never leave orphaned line rows.
 */
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

export { sequelize };
