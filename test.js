'use strict';

import test from 'ava';
import {Application} from 'spectron';
import path from 'path';

let app;

function getElectronPath() {
	let electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
	if (process.platform === 'win32') {
		electronPath += '.cmd';
	}
	return electronPath;
}

test.beforeEach(() => {
	app = new Application({
		args: [__dirname],
		path: getElectronPath()
	});

	return app.start();
});

test.afterEach(() => {
	if (app && app.isRunning()) {
		return app.stop();
	}

	return null;
});

test('shows an initial window', async t => {
	await app.client.waitUntilWindowLoaded(10000);
	t.is(1, await app.client.getWindowCount());
	t.is(false, await app.client.isWindowMinimized());
	t.is('30', await app.client.getValue('#form input[name=first]'));
	t.is('10', await app.client.getValue('#form input[name=last]'));

	await app.client.click('#form input[name=add]');
	t.is('40', await app.client.getValue('#form input[name=result]'));

	await app.client.click('#form input[name=sub]');
	t.is('20', await app.client.getValue('#form input[name=result]'));

	await app.client.click('#form input[name=multiple]');
	t.is('300', await app.client.getValue('#form input[name=result]'));

	await app.client.click('#form input[name=divide]');
	t.is('3', await app.client.getValue('#form input[name=result]'));
});
