const { users, posts, hashtags, PostHashtag } = require('../models');
const Sequelize = require('sequelize');


const Op = Sequelize.Op;
module.exports = {
    createPost: async({ content, username, }) => {
        const mentionRegex = /\s([@][\w_-]+)/g;
        const hashtagRegex = /\s([#][\w_-]+)/g;
        const contentHashtags = content.match(hashtagRegex)
        const contentMentions = content.match(mentionRegex)

        let hashtagsEntry = []
        contentHashtags.forEach(element => {
            hashtagsEntry.push({ hashtag: element.substring(1) })
        });

        let mentions = []
        contentMentions.forEach(element => {
            mentions.push(element.substring(2))
        });

        return posts.create({ creator: username, content: content, hashtags: hashtagsEntry }, { include: [hashtags, users] }).then(post => {
            if (mentions.length > 0) {
                return users.findAll({
                    where: {
                        username: {
                            [Op.or]: mentions
                        }
                    }
                }).then(users => {
                    return post.addMentions(users).then(mention => {
                        return ({ message: 'ok' })
                    }).then(users => {
                        return post.addMentions(users).then(mention => {
                            return ({ message: 'ok' })
                        }).catch(err => {
                            return { error: 'failed to save mentions' }
                        })
                    }).catch(err => {
                        return { error: 'failed to save mentions' }
                    })
                }).catch(err => {
                    return { error: 'failed to find users mentioned' }
                })
            } else {
                return ({ message: 'ok' })
            }
        }).catch(err => {
            return { error: 'failed to create post' }
        });
    },
    getAllPosts: async() => {
        return await posts.findAll({ include: [hashtags] });
    },
    getPost: async obj => {
        return await posts.findOne({
            where: obj,
        });
    },
    getRecent: async() => {
        return await posts.findAll({
            limit: 10,
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['id', 'creator', 'content'],
        }).then(entries => {
            return entries
        }).catch(err => {
            return { error: 'error finding recent posts' }
        })
    },
    getPostsByHashtag: async({ hashtag }) => {
        return hashtags.findAll({ where: { hashtag: '#' + hashtag }, attributes: ['id'], raw: true }).then(entries => {
            return posts.findAll({
                include: [{
                    model: hashtags,
                    where: {
                        [Op.or]: entries
                    },
                    attributes: []
                }],
                attributes: ['id', 'creator', 'content'],
                raw: true
            }).then(result => {
                let arr = []
                result.forEach(e => {
                    arr.push({ id: e.id, creator: e.creator, content: e.content })
                })
                return arr
            }).catch(err => {
                return { error: 'error finding posts' }
            })
        }).catch(err => {
            return { error: 'error finding hashtag' }
        })

    }
}