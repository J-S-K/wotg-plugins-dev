new Wotg.Plugins.Simple({
	title  : 'J_S',
	version: '0.2.3'
}, function (plugin, events) {
/*
	plugin.addImagesPreload({
		'test': 'image.png'
	});
*/
function jslog(text) {
	console.log('JS', text)
}
function test () {
console.log('J_S Plugin', 'test');
}
	console.log('J_S Plugin', { Wotg: Wotg, plugin: plugin, atom: atom});

	events.add('initialize', function () {
		console.log(plugin.title +' version ' + plugin.version + ' from ' + plugin.repository + ' initialized');
		test();
	});

	events.add('afterLaunch', function () {
	//	atom.dom(plugin.getImage('test')).appendTo('body');
	//	console.log(plugin.getImage('test'));
	console.log('J_S afterLaunch');
	
	});
	
	plugin.refactor( 'Wotg.Research.Manager', {
        // Меняем один из методов класса
        'createResearchTreeForHQ': function method(hqId) {
            
           	//this.backButton.text = Wotg.controller().lang.get('research.backToRoot');
		this.isRoot = false;
		this.selector.hide();
		this.destroyElems();
		var list = this.model.getCardListForHQ(hqId);
		var rootData = this.model.getCardById(hqId);
		jslog({list:list, rootData:rootData});
		this.createHq(rootData, true);
		for (var i = 0 ; i < list.length; i++) {
			if (Wotg.controller().protos.get(list[i].card).type.toLowerCase() != 'hq') {
				this.createCard(list[i]);
			} else {
			//	this.createHq(list[i], false, false);
			}
		}
		setTimeout(function(){
			var lines = new Wotg.Research.Lines(this.app.linesLayer.ctx, this.elems, this);
			lines.drawLines(false);
		}.bind(this), 50);

        }
    });
});
