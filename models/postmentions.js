'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostMentions = sequelize.define('postmentions', {
    mention: DataTypes.STRING,
    post: DataTypes.STRING
  }, {});
  PostMentions.associate = function(models) {
    // associations can be defined here
  };
  return PostMentions;
};