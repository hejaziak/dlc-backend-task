const { users, posts, hashtags } = require('../models');
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
            return post.addHashtags(post.hashtags).then(hashtag => {
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
                return { error: 'failed to save hashtags' }
            })
        }).catch(err => {
            return { error: 'failed to create post' }
        });
    },
    getAllPosts: async() => {
        return await posts.findAll();
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
    }
}