'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('song', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      proc: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      singer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      requester: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isReaction: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isRequest: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isToSing: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isComplete: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      video: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      thumbnail1: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      thumbnail2: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dates: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('song');
  }
};
