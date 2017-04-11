import { Meteor } from 'meteor/meteor';
import { data } from './data';

function transformData(){
	var transformedData = [];
	console.log('transforming data...');
	console.log(data.length);
	data.forEach(function(o){
		for(var prop in o){
			if(o[prop] != ''){
				transformedData.push({'newspaper': prop, 'postId': o[prop]});
			}
		}
	});
	console.log('done. length = ' + transformedData.length);
	return transformedData;
}

function fixtures(){
	if(Entries.find().count() == 0){
		console.log('doing fixtures');
		var transformed = transformData(data);
		transformed.forEach(function(o){
			o.hasReactions = false;
			Entries.insert(o);
		});
		console.log('done.');
	}
}

function transformToIncludeReactions(doc){
	var accessToken = 'EAACEdEose0cBAD3LctIYGLZCzRx7U7n85Le1wGybg5GObSDijeq3NNcyyt2mTKpCgJZAirhBZBV8E7Nou1lRtDwb4PcEZAqvDAOCu5hCn4X4UpICWp93jeRDgcqzTH7eWXGNBoQ7ZCZAyvpH7jK23DZA8yuLV8Obwh8ThdGEPUT5qZANipVrt2778IHCqNkhKMEZD';
	var accessTokenString = '?access_token='+accessToken;
	var queryString = 'https://graph.facebook.com/v2.8/' + doc.postId + '/reactions'+accessTokenString
	var result = HTTP.get(queryString);
	var reactions = result.data.data

	var result = {
		'hasReactions': true,
		'newspaper': doc.newspaper,
		'postId': doc.postId,
		'LIKE': 0,
		'LOVE': 0,
		'WOW': 0,
		'HAHA': 0,
		'SAD': 0,
		'ANGRY': 0,
		'THANKFUL': 0
	};

	reactions.forEach(function(reaction){
		result[reaction.type] = result[reaction.type] + 1;
	});

	return result;
}

fixtures();

function updateOne(){
	console.log('updating one...');
	var entry = Entries.findOne({'hasReactions': false});
	if(!entry){q
		console.log('all done sir!');
		return;
	}
	var transformed = transformToIncludeReactions(entry);
	Entries.update({'_id': entry._id}, transformed);
	console.log('done');
}

Meteor.setInterval(function(){
	// updateOne();
}, 300);




