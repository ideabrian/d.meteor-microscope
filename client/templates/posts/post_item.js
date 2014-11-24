Template.postItem.helpers({
  ownPost: function() {
    return this.userId === Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    throwError(error.reason);
    a.href = this.url;
    return a.hostname;
  }
});
