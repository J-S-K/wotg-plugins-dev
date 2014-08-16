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
	console.log('J_S Plugin', { Wotg: Wotg, Controller: Wotg.controller(), plugin: plugin, atom: atom});

	events.add('initialize', function () {
		console.log(plugin.title +' version ' + plugin.version + ' from ' + plugin.repository + ' initialized');
		test();
	});

	events.add('afterLaunch', function () {
	//	atom.dom(plugin.getImage('test')).appendTo('body');
	//	console.log(plugin.getImage('test'));
	console.log('J_S afterLaunch');
	
	});
	//========
atom.declare( 'Wotg.Research.HqCardItem', Wotg.Research.TreeItem, {

	size     : new Size(132, 130),
	slot     : null,

	configure: function method () {
		method.previous.call(this);

		this.slot    = this.data.slot;
		this.shape   = new Rectangle(this.getPos(), this.size);
		this.textShape   = new Rectangle(0, 0, this.shape.width, 20).moveTo(this.shape.from);

		this.events.add( 'mouseup', function (e) {
			Wotg.openPopup('ResearchCardView', {
				proto: this.proto,
				data: this.data,
				manager: this.manager
			});
		}.bind(this));

		this.model = new Wotg.Card.Models.Model(this.proto);
		this.view = new Wotg.Card.Views.TreeLeaf(this.model);
		this.view.events.add('redraw', this.redraw);
	},

	update: function() {
		this.redraw();
	},

	getPos: function() {
		return this.manager.cardSlotsCoords[this.slot];
	}
});
	function createCard (data) {
		//var manager = Wotg.Research.Manager();
		jslog({contrl:Wotg.controller()});
		jslog({this:this,  research:Wotg.research});
		jslog({manag:Wotg.research.manager()});
		var elem = new Wotg.Research.HqCardItem(manager.app.layer, {
			manager: manager,
			data: data
		});
		manager.app.mouseHandler.subscribe(elem);
		manager.elems.push(elem);
	}	
	function createHq (data, list) {
		for (var i = 0 ; i < list.length; i++) {
			
			createCard(list[i]);
		}
		
		/*
		var elem = new Wotg.Research.HQItem(this.app.layer, {
			manager: this,
			data: data,
			isCurrent: isCurrent,
			isRootTree: isRootTree
		});
					
		Wotg.openPopup('ResearchHqSet', {
				proto: this.proto,
				manager: this.manager
			});
			Wotg.Research.HQSet
			
		this.model = new Wotg.Card.Models.HqResearch(this.proto, this.data.exp);
		this.view = new Wotg.Card.Views.TreeHqOpened(this.model);
		this.view.events.add('redraw', this.redraw);
		
		this.app.mouseHandler.subscribe(elem);
		this.elems.push(elem);
		*/
		
	}
	
	plugin.refactor( 'Wotg.Research.Manager', {
        // Меняем один из методов класса
        'createResearchTreeForHQ': function method(hqId) {
            
           	//this.backButton.text = Wotg.controller().lang.get('research.backToRoot');
		this.isRoot = false;
		this.selector.hide();
		this.destroyElems();
		var list = this.model.getCardListForHQ(hqId);
		var listHq = this.model.getCardListForHQ(hqId, true);
		var rootData = this.model.getCardById(hqId);
		jslog({list:list, rootData:rootData, listHq:listHq, this:this});
		createHq(rootData, listHq);
		for (var i = 0 ; i < list.length; i++) {
			if (Wotg.controller().protos.get(list[i].card).type.toLowerCase() != 'hq') {
				this.createCard(list[i]);
			} else {
				this.createHq(list[i], false, false);
			}
		}
		setTimeout(function(){
			var lines = new Wotg.Research.Lines(this.app.linesLayer.ctx, this.elems, this);
			lines.drawLines(false);
		}.bind(this), 50);

        }
    });
});
