Template.postsList.helpers({
  posts: function() {
		return Posts.find();
	},
  log: function() {
    console.log(this);
  }
});
