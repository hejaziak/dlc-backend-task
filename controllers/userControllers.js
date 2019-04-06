const { users, posts } = require('../models');
const jwt = require('jsonwebtoken');


module.exports = {
    createUser: async({ username, firstname, lastname, email, password }) => {
        return await users.create({ username: username, firstname: firstname, lastname: lastname, email: email, password: password, posts: [{ content: "aaa" }] }, {
            include: [posts]
        });
    },
    getAllUsers: async() => {
        return await users.findAll();
    },
    getUser: async obj => {
        return await users.findOne({
            where: obj,
        });
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
        console.log(user)
        if (user != null) {
            console.log('ss')
            return (false, { error: 'username is taken' })
        } else {
            let user = await users.findOne({ where: { email } });
            if (user != null) {
                return ({ error: 'email is taken' })
            } else {
                users.create({ username, firstname, lastname, email, password }).then(user => {
                    return ({ message: 'successful' })
                }).catch(err => {
                    console.log("heee")
                    return ({ error: 'Error saving the instance' })
                });
            }
        }

    }
}