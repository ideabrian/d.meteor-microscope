Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

validatePost = function(post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in a headline";
    if (!post.url)
      errors.url = "Please fill in a URL";
      return errors;
    };

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },
  postUpdate: function(postAttributes, currentPostId) {

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
      if (postWithSameLink) {
        return {
          postExists: true,
          _id: postWithSameLink._id
        };
      }
    // what do we want it to do.

    var post = postAttributes;
    var postId = Posts.update(currentPostId, {$set:post},true);
    // console.log('The postId is: '+postId);
    return { _id: postId };
   },

  upvote: function(postId) {
    check(this.userId, String); // if there are no users logged in, we're getting an object here instead of a string.
    check(postId, String);

    var post = Posts.findOne(postId);

    if (!post) {
      alert("!post in posts.js");
      throw new Meteor.Error('invalid', 'Post not found');
    }
    if (_.include(post.upvoters, this.userId)) {
      alert("already upvoted");
      throw new Meteor.Error('invalid', 'Already upvoted this post');
    }
    Posts.update(post._id, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
  }
});
