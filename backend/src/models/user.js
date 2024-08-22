'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  };
  user.init({
      user_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      refToken: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      expires: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
