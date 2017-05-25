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
	var accessToken = 'EAAVdtJmUjtoBAHt4CLMgiHnuIFdPL3BTccgwxCZCL70zbVS0rbzhSbjRGfbZBUNZBHTRLpE2ohj27UO6ncmezUb2AJWIZCOK4NoPZCDrPCjZClvAqYbVBZBuptBJqmRC3cDObHcirdJGqZCA7RTKWLVfg2dKugcKGg8ZD';
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

function getReactionsForOneEntry(){
	console.log('updating one...');
	var entry = Entries.findOne({'hasReactions': false});
	if(!entry){
		console.log('all done sir!');
		return;
	}
	var transformed = transformToIncludeReactions(entry);
	Entries.update({'_id': entry._id}, transformed);
	console.log('done');
}

function migrateToIncludeHasText(){
	console.log('migrating');
	Entries.find().forEach(e => {
		Entries.update({'_id': e._id}, {$set: {hasText: false}})
	})
	console.log('done');
}


Meteor.startup(function(){
	console.log('Total entries: ' + Entries.find().count());
	console.log('Entries with Reactions: '+ Entries.find({'hasReactions': true}).count());
	console.log('Entries with Text: '+ Entries.find({'haText': true}).count());
});

/*
 delted: 
 	postId: 118231518201711_1301472006544317
	postId: 29396596956_10154169294496957
	postId: 177194474660_10154847634874661
	
*/
