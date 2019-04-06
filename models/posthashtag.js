'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostHashtag = sequelize.define('PostHashtag', {
    hashtag: DataTypes.STRING,
    post: DataTypes.STRING
  }, {});
  PostHashtag.associate = function(models) {
    // associations can be defined here
  };
  return PostHashtag;
};