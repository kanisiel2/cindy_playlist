'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class webtoken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  };
  webtoken.init({
    endpoint: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.STRING(700),
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'webtoken',
  });
  return webtoken;
};
