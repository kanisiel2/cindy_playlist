'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ranking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  };
  ranking.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },    
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },    
    user: {
      type: DataTypes.INTEGER,
      allowNull: true
    },       
    point: {
      type: DataTypes.INTEGER,
      allowNull: true
    },       
    season: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ranking',
  });
  return ranking;
};
