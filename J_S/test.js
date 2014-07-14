Wotg_Plugins.get().addSimplePlugin('TestPlugin', '0.2.2', function (api) {
	console.log('TestPlugin 0.2.2 JS', { Wotg: Wotg, api: api, atom: atom });
});
