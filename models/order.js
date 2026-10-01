/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
const { Model } = require('sequelize');

/**
 * An Order is one checkout: it belongs to a User and groups together the
 * OrderItems that were purchased. We store the money total on the order itself
 * (rather than recomputing it from items every time) so the amount the customer
 * actually paid is frozen in history, even if item rows or prices change later.
 *
 * Associations are declared in `lib/models.ts` (the file the running app uses),
 * not in a static `associate()` here, to match how User/Category are wired.
 */
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {}

  Order.init(
    {
      // Who placed the order. FK -> Users.id. Set up in lib/models.ts.
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Lifecycle of the order. ENUM keeps the column to a known set of values.
      status: {
        type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      // Grand total paid, in Naira. DECIMAL(10,2) avoids floating-point money
      // errors. Note: the pg driver returns DECIMAL as a *string*, so the data
      // layer (lib/order-store.ts) parses it back to a number before the UI.
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );

  return Order;
};
