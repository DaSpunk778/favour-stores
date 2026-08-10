'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    item_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    thumbnail_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};