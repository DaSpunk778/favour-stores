/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

/**
 * One line in an order (a product + the quantity bought).
 *
 * Why we SNAPSHOT the product details (name, price, image) instead of just
 * storing a product id: the catalog lives in a JSON file (lib/product-store.ts),
 * not in this database, so there is no products table to foreign-key to. More
 * importantly, an order is a historical record — if the admin later edits a
 * product's price or deletes it, the customer's past order must still show what
 * they actually bought and paid. So we copy those values in at checkout time.
 *
 * `productId` is kept only as a soft reference (to link back to the live product
 * page if it still exists); it is a plain string, not a FK.
 */
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {}

  OrderItem.init(
    {
      // FK -> Orders.id. Association + cascade delete set up in lib/models.ts.
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Soft reference to the catalog product (string ids like "1", "2").
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // --- Snapshot fields: frozen at purchase time ---
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Unit price at purchase time (Naira). DECIMAL for the same money-safety
      // reason as Order.total; the data layer parses it back to a number.
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
    }
  );

  return OrderItem;
};
