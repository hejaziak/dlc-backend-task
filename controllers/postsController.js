const { users, posts, hashtags, PostHashtag } = require('../models');
const Sequelize = require('sequelize');
const { messages } = require('../services/responseMessages')


const Op = Sequelize.Op;
module.exports = {
    createPost: async({ content, username }) => {
        const mentionRegex = /\s([@][\w_-]+)/g;
        const hashtagRegex = /\s([#][\w_-]+)/g;
        const contentHashtags = content.match(hashtagRegex)
        const contentMentions = content.match(mentionRegex)

        let hashtagsEntry = []
        if (contentHashtags) {

            contentHashtags.forEach(element => {
                hashtagsEntry.push({ hashtag: element.substring(1) })
            });
        }
        let mentions = []
        if (contentMentions) {

            contentMentions.forEach(element => {
                mentions.push(element.substring(2))
            });
        }

        return posts.create({ content: content, hashtags: hashtagsEntry }, { include: [hashtags, users] }).then(post => {
            return users.findOne({ where: { username } }, { include: [posts] }).then(user => {
                return user.addPosts(post.id).then(e => {
                    if (mentions.length > 0) {
                        return users.findAll({
                            where: {
                                username: {
                                    [Op.or]: mentions
                                }
                            }
                        }).then(usersMentioned => {
                            return post.addMentions(usersMentioned).then(mention => {
                                return ({ message: 'ok' })
                            }).catch(err => {
                                return { error: { text: messages.posts.mentionFail, status: 400 } }
                            })
                        }).catch(err => {
                            return { error: { text: messages.posts.userFail, status: 400 } }
                        })
                    } else {
                        return ({ message: { text: messages.posts.successfulCreation, status: 400 } })
                    }
                }).catch(err => {
                    return err
                })
            })
        }).catch(err => {
            return { error: { text: messages.posts.failedCreation, status: 500 } }
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
            return { error: { text: messages.posts.failedRecent, status: 500 } }
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
                    attributes: [],
                    through: {
                        attributes: []
                    }
                }],
                attributes: ['id', 'creator', 'content'],
            }).then(result => {
                if (result.length > 0)
                    return result
                else {
                    return { error: { text: messages.posts.hashtagNotFound, status: 400 } }
                }
            }).catch(err => {
                return { error: { text: messages.posts.failedPostFinding, status: 500 } }
            })
        }).catch(err => {
            return { error: { text: messages.posts.failedHashtafFinding, status: 500 } }
        })

    }
}