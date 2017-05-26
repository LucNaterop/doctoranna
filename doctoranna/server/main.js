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

fixtures();

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

function cleanDoubleEntries(){
	console.log('cleaning double entries....');
	var i = 1;
	Entries.find().fetch().forEach(e => {
		console.log(i++);
		var entries = Entries.find({'postId': e.postId}).fetch();
		if(entries.length == 0){
			console.log('HEY NOT GOOD');
		}
		if(entries.length > 1){
			console.log('lets punch this guy out, fucking retard');
			Entries.remove(entries[1]._id);
		}
	});
	console.log('done. ');
}

function getTextForOneEntry(){
	console.log('updating one...');
	var entry = Entries.findOne({'hasText': false});
	if(!entry){
		console.log('all done sir!');
		return;
	}

	var accessToken = 'EAAVdtJmUjtoBAHt4CLMgiHnuIFdPL3BTccgwxCZCL70zbVS0rbzhSbjRGfbZBUNZBHTRLpE2ohj27UO6ncmezUb2AJWIZCOK4NoPZCDrPCjZClvAqYbVBZBuptBJqmRC3cDObHcirdJGqZCA7RTKWLVfg2dKugcKGg8ZD';
	var accessTokenString = '?access_token='+accessToken;
	var queryString = 'https://graph.facebook.com/v2.8/' + entry.postId + accessTokenString
	var result = HTTP.get(queryString);
	console.log(result.data);
	Entries.update({'postId': result.data.id}, {$set: {'text': result.data.message, 'hasText': true}});

	console.log('done');
}


Meteor.startup(function(){
	console.log('Total entries: ' + Entries.find().count());
	console.log('Entries with Reactions: '+ Entries.find({'hasReactions': true}).count());
	console.log('Entries with Text: '+ Entries.find({'hasText': true}).count());

});

/*
 delted: 
 	postId: 118231518201711_1301472006544317
	postId: 29396596956_10154169294496957
	postId: 177194474660_10154847634874661
	
*/
