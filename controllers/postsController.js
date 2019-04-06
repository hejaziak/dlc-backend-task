const { users, posts, hashtags } = require('../models');
module.exports = {
    createPost: async({ content, username, mentions, content_hashtags }) => {
        let hashtagsEntry = []
        content_hashtags.forEach(element => {
            hashtagsEntry.push({ hashtag: element })
        });
        return posts.create({ creator: username, content: content, hashtags: hashtagsEntry }, { include: [hashtags, users] }).then(post => {
            post.addHashtags(post.hashtags).then(hashtag => {
                users.findAll({ mentions }).then(users => {
                    post.addMentions(users).then(mention => {
                        return { message: 'ok' }
                    }).catch(err => {
                        return { error: 'failed to save mentions' }
                    })
                }).catch(err => {
                    return { error: 'failed to find users mentioned' }
                })
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
    }
}