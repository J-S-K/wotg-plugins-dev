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
	
	console.log.apply( console, ['[JS Log] '].append(arguments) );
	
}

	events.add('initialize', function () {
		console.log(plugin.title +' version ' + plugin.version + ' from ' + plugin.repository + ' initialized');

	});

	events.add('afterLaunch', function () {
	//	atom.dom(plugin.getImage('test')).appendTo('body');
	//	console.log(plugin.getImage('test'));
	console.log('J_S afterLaunch');
	
	});
	//========
atom.declare( 'Wotg.Research.HqCardItem', Wotg.Research.CardItem, {

	getPos: function() {
		return this.manager.HQcardSlotsCoords[this.slot];
	}
});

	//удалить если будут меняться координаты штаба 
	plugin.refactor( 'Wotg.Research.HQItem', {
        // Меняем один из методов класса
        'getPos': function method() {
        	if (this.isCurrent) return this.manager.JShqSlotsCoords[0];
		if (this.isRootTree) return this.manager.hqSlotsCoords[this.slot];
		return this.manager.cardSlotsCoords[this.slot];
	}
	});
	
	plugin.refactor( 'Wotg.Research.Manager', {
        // Меняем один из методов класса
        'setViewMode': function method(viewMode) {
        	method.previous.apply( this, arguments );
        if (viewMode == 'compact') {
			this.JShqSlotsCoords = this.JSsmallHq;
			this.HQcardSlotsCoords = this.HQsmallCards;
		} else {
			this.JShqSlotsCoords = this.JSbigHq;
			this.HQcardSlotsCoords = this.HQbigCards;
		}
	}
	});
        	
        	
	plugin.refactor( 'Wotg.Research.Manager', {
        // Меняем один из методов класса
        'createHqCard': function  (data) {
		var elem = new Wotg.Research.HqCardItem(this.app.layer, {
			manager: this,
			data: data
		});
		this.app.mouseHandler.subscribe(elem);
		this.elems.push(elem);
	},
	'createHqHq': function  (data, list) {
		var elem = new Wotg.Research.HQItem(this.app.layer, {
			manager: this,
			data: data,
			isCurrent: true,
			isRootTree: false
		});
		this.app.mouseHandler.subscribe(elem);
		this.elems.push(elem);
		
		for (var i = 0 ; i < list.length; i++) { 
			list[i].slot = i+1;
			this.createHqCard(list[i]);
		}
		
		
	},
        'createResearchTreeForHQ': function method(hqId) {
           	//this.backButton.text = Wotg.controller().lang.get('research.backToRoot');
		this.isRoot = false;
		this.selector.hide();
		this.destroyElems();
		var list = this.model.getCardListForHQ(hqId);
		var listHq = this.model.getCardListForHQ(hqId, true);
		var rootData = this.model.getCardById(hqId);
		jslog({list:list, rootData:rootData, listHq:listHq, this:this});
		this.createHqHq(rootData, listHq);
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

        },
        'cardSlotsCoords': {},
        'HQbigCards': {
		0: new Point(240, 0),
		1: new Point(484, 0), 
		2: new Point(728, 0),//101
		3: new Point(972, 0),
		4: new Point(1217, 0),
		5: new Point(484, 140),
		6: new Point(728, 140),
		7: new Point(972, 140),
		8: new Point(1217, 140)
		

	},
	'HQsmallCards': {
		0: new Point(108, 0),
		1: new Point(267, 0), 
		2: new Point(444, 0),//101
		3: new Point(621, 0),
		4: new Point(799, 0),
		5: new Point(267, 120),
		6: new Point(444, 120),
		7: new Point(621, 120),
		8: new Point(799, 120)
		

	},
	'JShqSlotsCoords' :{},
	'JSbigHq' : {
		0: new Point(150, 50)
		
	},
	'JSsmallHq':{
		0: new Point(0, 50)
	}
    //========================================================   
    	,
    	'createBackButton': function method() {
    		method.previous.apply( this, arguments );

    		//if (!this.isRoot) {
			this.allButton = Wotg.controller().ui.buttons.header.create({
					onActivate: function(){
						//function
						Wotg.openScreen('Research', { nation : this.defaultNation, mode :'all' });;
					}.bind(this)
				},
				'tree-root'
			);
			jslog(this.allButton);
			var targetNode = Wotg.controller().screens.headerNode;
			this.allButton.element.css('position', 'absolute')
				.css('left', 120 )
				.css('top', 6 );
			this.allButton.element.addClass("all-button").appendTo(targetNode);
		//}
    	},
    	'destroy': function method() {
    		method.previous.apply( this, arguments );
    		if (this.allButton) this.allButton.destroy();
    	},
    	'initialize': function method(node, viewMode, screenOpenData) {
           if (screenOpenData.mode) {
    		this.setViewMode(viewMode);
		this.node = node;
		this.elems = [];
		this.createApp();
		this.model = Wotg.controller().model.get('research');

		if (screenOpenData.nation) this.defaultNation = screenOpenData.nation;

		this.createNationNavigator();
		/*
		if (screenOpenData.nation) {
			this.createRoot();
		} else if (screenOpenData.hqId) {
			this.defaultNation = Wotg.controller().protos.get(screenOpenData.hqId).country.toLowerCase();
			this.createResearchTreeForHQ(screenOpenData.hqId);
			this.currentHq = screenOpenData.hqId;
		} else {
			var deck = Wotg.controller().model.get('decks').current;
			if (deck) {
				this.defaultNation = deck.hqProto.country.toLowerCase();
				this.createResearchTreeForHQ(deck.hqProto.id);
				this.currentHq = deck.hqProto.id;
			} else {
				this.createRoot();
			}
		}
		*/
		jslog(this.model, this.defaultNation );
		
		var list = this.model.getTreeByNation(this.defaultNation );
		list.sort (function(a,b) {
			return (Wotg.controller().protos.get(a.id).level - Wotg.controller().protos.get(b.id).level)
		});
		for (var i = 0 ; i < list.length; i++) { //list.length
			list[i].slot = i;
		//	this.createHqCard(list[i]);
			var elem = new Wotg.Research.AllCardItem(this.app.layer, {
			manager: this,
			data: list[i]
		});
		this.app.mouseHandler.subscribe(elem);
		this.elems.push(elem);
		}
		
		this.createBackButton();

		this.flagElem = atom.dom.create('div').addClass('big-nation').appendTo('body');
		this.setBgFlag(this.defaultNation);
    	   } else {
    	   	method.previous.apply( this, arguments );
    	   }
    		
    		
    	}
    		
    });
    atom.declare( 'Wotg.Research.AllCardItem', Wotg.Research.CardItem, {

	getPos: function() {
		var columns = 12,
		width = 127,
		hight = 127,
		x = this.slot % columns,
		y= (this.slot-x) / columns;
		return new Point (x*width,y*hight+40);
	}
    });
    
    plugin.refactor( 'Wotg.Research.HQItem', {
        // Меняем один из методов класса
        'configure': function  method() {
        	method.previous.call(this);

		this.isCurrent = this.settings.get('isCurrent');
		this.isRootTree = this.settings.get('isRootTree');
		this.slot    = this.isRootTree ? this.data.hqSlot : this.data.slot;
		this.shape   = new Rectangle(this.getPos(), this.getSize());
		this.textShape   = new Rectangle(0, 0, this.shape.width, 20).moveTo(this.shape.from);

		this.events.add( 'mouseup', function (e) {
			if (this.isCurrent) {
				Wotg.openPopup('ResearchHqSet', {
					proto: this.proto,
					manager: this.manager
				});
			} else {
				//this.manager.currentHq = this.data.card;
				//this.manager.createResearchTreeForHQ(this.data.card);
				Wotg.openScreen('Research', { hqId : this.data.card });
			}
		}.bind(this));

		if (!this.isCurrent) {
			this.model = new Wotg.Card.Models.HqResearch(this.proto, this.data.exp);
			this.view = new Wotg.Card.Views.TreeHqClosed(this.model);
			this.view.events.add('redraw', this.redraw);
		} else {
			this.model = new Wotg.Card.Models.HqResearch(this.proto, this.data.exp);
			this.view = new Wotg.Card.Views.HqBattle(this.model, this.redraw);
			this.view.events.add('redraw', this.redraw);
		}

		this.setModelExp();
        },
        'sizeCurrent': new Size(252, 250)
    });
    
});
