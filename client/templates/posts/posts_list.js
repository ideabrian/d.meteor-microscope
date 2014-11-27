Template.postsList.helpers({
  posts: function() {
		return Posts.find({}, {sort: {submitted: -1}});
	}
});
Meteor.startup(function() {
  Tracker.autorun(function() {
    throwError('There are ' + Posts.find().count() + ' posts');
  });
});
