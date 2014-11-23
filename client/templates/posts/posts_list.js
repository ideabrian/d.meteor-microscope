var postsData = [
	{
		title: "Introducing Teloscope",
		url: "http://sachagreif.com/introducing-telescope/"
	},
	{
		title: "Meteor",
		url: "http://meteor.com"},
	{
		title: "The Meteor Book",
		url: "http://themeteorbook.com"
	}

];

Template.postsList.helpers({
  posts: postsData
});
