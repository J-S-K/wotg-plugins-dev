new Wotg.Plugins.Simple({
	title  : 'J_S',
	version: '0.2.4'
}, function (plugin, events) {
/*
	plugin.addImagesPreload({
		'test': 'image.png'
	});
*/
var N = 150000, //обработать до ID
    low = 1000, // минимум боев
    lowCount =100,
    center,showResearchData,
    step = 3000;
    
var req = N/step,
    start =0,
    pause = 1500,
    players =[],
    stop = 0,
    errors = [],
    statN = [0, 1, 5,10,50,100,150,200,250,300,500, 1000, 1500, 2000, 2500,3000,3500,4000,5000,6000,7000,8000,9000,10000],
    statC=[],
    startID= 1,
    err =0,
    menu,stat , hqstat,medalstat,i,sent, recevied, pp,exp,cost,done,
    end,startE,endE,stepE,callback;
    
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
						Wotg.openScreen('DeckEditor', { deck: this.openData.deck, hq: this.openData.hq, mode :'all' });
					}.bind(this)
				},
				'tree-root'
			);
		jslog(this.allButton);
		jslog(this);
		/*
		this.allButton.element.css('position', 'absolute')
			.css('left', 120 )
			.css('top', 6 );
		*/
		Wotg.controller().screens.header.addElement(this.allButton, "allButton", "left", false);
		
		
		//==
		jslog(this.openData);
		if (!this.openData.mode) {
			this.manager.initDeck(this.openData.deck, this.openData.hq);
			this.manager.resize(this.currentViewMode);
		} else {
			jslog('allMode');
		}
    	},
    	'onClose': function method() {
    		method.previous.apply( this, arguments );
    		if (this.allButton) this.allButton.destroy();
	}
	});
	/*
	plugin.refactor( 'Wotg.DeckEditor.Controller', {
        // Меняем один из методов класса
        'initDeck': function method(deck, hq) {
        */	

	//========
	function getId2 () {
        end = start+step-1;
        //api.log('getId2:start,end',start,end);
        Wotg.controller().connection.send('player/profile', { ids: atom.array.range(start, end) }, function (result) {
            //   api.log(result);
            if (result.error) {
                jslog('Ошибка получения players id from position ',start);
                getErrors2(start,end, false);
            } else {
                //the end
                if (result.players.length == 0){ 
                    stop = true;
                    setPlayers();
                } else {
                    //ok
                    result.players.forEach(function (pl) {
                        if (pl.nickname) {
                            players[pl.id]= pl;
                        }
                    }); //foreach
                    
                    start+=step;
                    getId2();
                    
                }
            }//if
            
        }); //send
        
    }// getId2
    function getErrors2 (startE,end,step) {
        jslog('getError2:start,end,step',start,end,step);
        if (!step) {
            // startE=start;
            
            stepE=(end-startE+1)/10;
            jslog(stepE);
            if (stepE<1) { 
                stepE=1;
            }
            endE=startE+stepE-1;
        } else {
            endE=startE+step-1;
        }
        jslog('getError2:startE,endE,stepE',startE,endE,stepE);
        Wotg.controller().connection.send('player/profile', { ids: atom.array.range(startE, endE) }, function (result) {
            //   api.log(result);
            if (result.error) {
                jslog('Ошибка получения players id from position ',startE);
                if (stepE !=1) {
                    getErrors2(startE,endE);
                } else {
                    start =  startE+1;
                    getId2();
                }
            } else {
                //the end
                if (result.players.length == 0){ 
                    stop = true;
                    setPlayers();
                } else {
                    //ok
                    result.players.forEach(function (pl) {
                        if (pl.nickname) {
                            players[pl.id]= pl;
                        }
                    }); //foreach
                    jslog('endE,end',endE,end);
                    if (endE!= end) {
                        startE+=stepE;
                        getErrors2(startE,end,stepE);
                    } else {
                        start=end+1;
                        getId2();
                    }
                }
            }//if
            
        }); //send
        
    } //geterrors2
    function setPlayers () {
        
        jslog('all', players.length);
        /*    setTimeout( function () {
            GM_setValue('players',players);
        },0);
        */
        StatCount(players);
        players.sort(function (a,b) { 
            return (b.gamesCount - a.gamesCount);
        });
        var text ='<table>';
        var total = {
            'gamesCount' : 0,
            'credits':0,
            'gold':0};
        for (var i = 0; i < 100; i++) {
            if (players[i]) {
                
                text = text
                +'<tr><td>'+players[i].id
                +'</td><td>'+players[i].nickname 
                +'</td><td>' + players[i].email
                +'</td><td>' + players[i].gamesCount
                +'</td><td>' + players[i].credits
                +'</td><td>' + players[i].gold
                +'</td></tr>';
                total.gamesCount += players[i].gamesCount;
                total.credits 	 += players[i].credits;
                total.gold 		 += players[i].gold;
            }
            
        }
        text+= '</table>';
        var w = window.open('about:blank');
        w.document.body.innerHTML = text; //'<pre>'+stat+'</pre>';
        jslog(total);
        
    } //setPlayers
    function StatCount (result) {
        for (var i = 0; i < statN.length; i++) {
            statC[i]=0;
        }
        jslog(result);
        if (result.length > 0 ) {
            result.forEach(function (pl) {
                //   api.log(pl);
                if(pl) {
                    for (var i = 0; i < statN.length; i++) {
                        if (pl.gamesCount >= statN[i]) {
                            statC[i]++;
                        }
                    }
                }
            });
            var statT = '<table>';
            for (var i = statN.length-1; i >-1; i--) {
                statT += '<tr><td>' + statN[i] +'</td><td>'+statC[i] +'</td></tr>';
            }
            var w = window.open('about:blank');
            w.document.body.innerHTML = statT;
            
            
        }
    }//statCount
    
	plugin.refactor( 'Wotg.Screens.Hangar', {
        // Меняем один из методов класса
        'onOpen': function method() {
		
		method.previous.apply( this, arguments );
		//==
		this.manager.aButton = this.aButton = Wotg.controller().ui.buttons.header.create({
					onActivate: function(){
						//function
						getId2 ();
					}.bind(this)
				},
				'tree-root'
			);
		jslog(this.aButton);
		jslog(this);
		/*
		this.allButton.element.css('position', 'absolute')
			.css('left', 120 )
			.css('top', 6 );
		*/
		Wotg.controller().screens.header.addElement(this.aButton, "aButton", "right", false);
		
    	},
    	'onClose': function method() {
    		method.previous.apply( this, arguments );
    		if (this.aButton) this.aButton.destroy();
	}
	});

});
