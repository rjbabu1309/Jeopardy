'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trailers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Trailers.init({
    clue: DataTypes.STRING,
    ans: DataTypes.STRING,
    value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Trailers',
  });
  return Trailers;
};