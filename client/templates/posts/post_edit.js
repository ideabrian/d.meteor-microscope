Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postEditErrors', errors);

    Meteor.call('postUpdate', post, currentPostId, function(error, result){
      if (error)
        // display the error to the user
        return throwError(error.reason);

      if (result.postExists)
        throwError('This URL is already linked');
    });

      Router.go('postPage', {_id: currentPostId});
    },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});

Template.postEdit.created = function() {
Session.set('postEditErrors', {});
};

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
},
errorClass: function(field) {
  return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
}
});
