'use strict'
const bcrypt = require("bcrypt-nodejs");
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
    users.associate = function(models) {
        // associations can be defined here
        users.hasMany(models.posts, { foreignKey: 'creator', targetKey: 'username', as: 'posts' })
        users.belongsToMany(models.posts, { through: 'postmentions', foreignKey: 'mention' })
    };

    users.beforeCreate((user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    users.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

    return users;
};