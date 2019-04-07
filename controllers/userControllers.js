const { users, posts } = require('../models');
const jwt = require('jsonwebtoken');
const sequelize = require('../models/index');


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
        })
    },
    login: async(username, password) => {
        if (username && password) {
            var user = await users.findOne({ where: { username } });
            if (!user) {
                return ({ error: 'username is incorrect' });
            }
            if (user.validPassword(password)) {
                var payload = { username: user.username };
                var token = jwt.sign(payload, 'secret');
                return ({ message: 'ok', token: token });
            } else {
                return ({ error: 'Password is incorrect' });
            }
        }
    },
    signup: async({ username, firstname, lastname, email, password }) => {
        let user = await users.findOne({ where: { username } });
        if (user != null) {
            return (false, { error: 'username is taken' })
        } else {
            let user = await users.findOne({ where: { email } });
            if (user != null) {
                return ({ error: 'email is taken' })
            } else {
                return users.create({ username, firstname, lastname, email, password }).then(user => {
                    return ({ message: 'successful' })
                }).catch(err => {
                    console.log("heee")
                    return ({ error: 'Error saving the instance' })
                });
            }
        }

    }
}