const { users, posts } = require('../models');
const jwt = require('jsonwebtoken');
const sequelize = require('../models/index');
const { messages } = require('../services/responseMessages')


module.exports = {
    createUser: async({ username, firstname, lastname, email, password }) => {
        return await users.create({ username: username, firstname: firstname, lastname: lastname, email: email, password: password, posts: [{ content: "aaa" }] }, {
            include: [posts]
        });
    },
    getAllUsers: async() => {
        return await users.findAll({ include: [posts] });
    },
    getUser: async({ username }) => {
        let query = "SELECT * FROM users INNER JOIN posts ON users.username = posts.creator WHERE users.username = \"" + username + "\""
        console.log(query)
        return sequelize.sequelize.query(query, { type: sequelize.sequelize.QueryTypes.SELECT }).then((results) => {
            let posts = []
            results.forEach(element => {
                posts.push({ id: element.id, content: element.content })
            });
            let profile = { username: results[0].username, firstname: results[0].firstname, lastname: results[0].lastname, email: results[0].email, posts: posts }
            return profile
        }).catch(err => {
            return {
                error: { text: messages.user.incorrectUser, status: 400 }
            }
        })
    },
    login: async(username, password) => {
        if (username && password) {
            var user = await users.findOne({ where: { username } });
            if (!user) {
                return {
                    error: { text: messages.login.incorrectUsername, status: 400 }
                }
            }
            if (user.validPassword(password)) {
                var payload = { username: user.username };
                var token = jwt.sign(payload, 'secret');
                return { message: messages.login.successfulLogin, token: token };
            } else {
                return { error: { text: messages.login.incorrectPassword, status: 400 } };
            }
        }
    },
    signup: async({ username, firstname, lastname, email, password }) => {
        let user = await users.findOne({ where: { username } });
        if (user != null) {
            return { error: { text: messages.signup.incorrectUsername, status: 400 } }
        } else {
            let user = await users.findOne({ where: { email } });
            if (user != null) {
                return { error: { text: messages.signup.incorrectEmail, status: 400 } }
            } else {
                return users.create({ username, firstname, lastname, email, password }).then(user => {
                    return { message: messages.signup.successfulSignup }
                }).catch(err => {
                    return { error: { text: messages.signup.internalError, status: 400 } }
                });
            }
        }

    }
}