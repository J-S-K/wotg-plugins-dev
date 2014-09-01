new Wotg.Plugins.Simple({
	title  : 'J_S',
	version: '0.2.4'
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
	plugin.refactor( 'Wotg.Screens.DeckEditor', {
        // Меняем один из методов класса
        'onOpen': function method() {
		if(this.isOpenFirstTime) {
			this.launchScreen();
			this.isOpenFirstTime = false;
		}

		Wotg.controller().screens.header.addElement(this.backButton, "backButton", "left", false);

		//==
		this.manager.allButton = this.allButton = Wotg.controller().ui.buttons.header.create({
					onActivate: function(){
						//function
						Wotg.openScreen('Research', { nation : this.defaultNation, mode :'all' });;
					}.bind(this)
				},
				'tree-root'
			);
		jslog(this.allButton);
		jslog(this);
		
		this.allButton.element.css('position', 'absolute')
			.css('left', 120 )
			.css('top', 6 );
		
		Wotg.controller().screens.header.addElement(this.allButton, "allButton", "left", false);
		
		
		//==
		this.manager.initDeck(this.openData.deck, this.openData.hq);
		this.manager.resize(this.currentViewMode);
    	},
    	'onClose': function method() {
    		method.previous.apply( this, arguments );
    		if (this.allButton) this.allButton.destroy();
	}
	});

	

});
