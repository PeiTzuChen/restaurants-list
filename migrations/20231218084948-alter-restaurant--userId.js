'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn("Restaurants", "userId", {
       type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
     queryInterface.changeColumn("Restaurants", "userId", {
       type: Sequelize.DataTypes.INTEGER,
       allowNull: true,
     });
  }
};
