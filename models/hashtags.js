'use strict';
module.exports = (sequelize, DataTypes) => {
  const hashtags = sequelize.define('hashtags', {
    hashtag: DataTypes.STRING
  }, {});
  hashtags.associate = function(models) {
    // associations can be defined here
    hashtags.belongsToMany(models.posts,{ through: 'posthashtags',foreignKey: 'hashtag' })
  };
  return hashtags;
};