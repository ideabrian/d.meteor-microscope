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
      commentsCount: 0
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
    console.log('The postId is: '+postId);
    return { _id: postId };
   }
});
