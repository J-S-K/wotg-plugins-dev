new Wotg.Plugins.Simple({
	title  : 'J_S',
	version: '0.2.3'
}, function (plugin, events) {
/*
	plugin.addImagesPreload({
		'test': 'image.png'
	});
*/	
function test () {
console.log('J_S Plugin', 'test');
}
	console.log('J_S Plugin', { Wotg: Wotg, plugin: plugin, atom: atom});

	events.add('initialize', function () {
		console.log(plugin.title +' version ' + plugin.version + ' from ' + plugin.repository + ' initialized');
	});

	events.add('afterLaunch', function () {
	//	atom.dom(plugin.getImage('test')).appendTo('body');
	//	console.log(plugin.getImage('test'));
	console.log('J_S afterLaunch');
	test;
	});
});
