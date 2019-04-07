'use strict';
module.exports = (sequelize, DataTypes) => {
    const posts = sequelize.define('posts', {
        creator: DataTypes.STRING,
        content: DataTypes.STRING
    }, {});
    posts.associate = function(models) {
        // associations can be defined here
        console.log(models)
        posts.belongsToMany(models.hashtags, { through: 'posthashtags', foreignKey: 'post' })
        posts.belongsToMany(models.users, { through: 'postmentions', as: 'mentions', foreignKey: 'post' })
        posts.belongsTo(models.users, { foreignKey: 'creator', targetKey: 'username' })

    };
    return posts;
};