'use strict';

import test from 'ava';
import {Application} from 'spectron';
import electronBin from 'electron-bin-path';

test.beforeEach(t => {
	return electronBin().then(p => {
		t.context.app = new Application({
			args: [__dirname],
			path: p
		});

		return t.context.app.start();
	});
});

test.afterEach(t => {
	return t.context.app.stop();
});

test('Measure BrowserWindow status', t => {
	const app = t.context.app;

	return app.client.waitUntilWindowLoaded()
		.getWindowCount().then(count => {
			t.is(count, 1);
		}).browserWindow.isMinimized().then(min => {
			t.false(min);
		}).browserWindow.isDevToolsOpened().then(opened => {
			t.false(opened);
		}).browserWindow.isVisible().then(visible => {
			t.true(visible);
		}).browserWindow.isFocused().then(focused => {
			t.true(focused);
		}).browserWindow.getBounds().then(bounds => {
			t.true(bounds.width > 0);
			t.true(bounds.height > 0);
		});
});

test('Measure BrowserWindow status with await', async t => {
	const app = t.context.app;
	await app.client.waitUntilWindowLoaded();
	const win = app.browserWindow;

	t.is(1, await app.client.getWindowCount());
	t.false(await win.isMinimized());
	t.false(await win.isDevToolsOpened());
	t.true(await win.isVisible());
	t.true(await win.isFocused());

	const {width, height} = await win.getBounds();
	t.true(width > 0);
	t.true(height > 0);
});

test('Determine values of input', async t => {
	const app = t.context.app;

	await app.client.waitUntilWindowLoaded();
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
