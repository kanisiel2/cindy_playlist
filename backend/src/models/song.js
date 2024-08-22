'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  };
  song.init({
    proc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    singer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    requester: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isReaction: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRequest: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isToSing: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isComplete: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    video: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dates: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'song',
  });
  return song;
};
