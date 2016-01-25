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

test(t => {
	const app = t.context.app;

	return app.client.waitUntilWindowLoaded(10000)
		.getWindowCount().then(count => {
			t.is(count, 1);
		}).isWindowMinimized().then(min => {
			t.false(min);
		}).isWindowDevToolsOpened().then(opened => {
			t.false(opened);
		}).isWindowVisible().then(visible => {
			t.true(visible);
		}).isWindowFocused().then(focused => {
			t.true(focused);
		}).getWindowWidth().then(width => {
			t.ok(width > 0);
		}).getWindowHeight().then(height => {
			t.ok(height > 0);
		});
});

test(async t => {
	const app = t.context.app;

	await app.client.waitUntilWindowLoaded(10000);
	t.is(1, await app.client.getWindowCount());
	t.false(await app.client.isWindowMinimized());
	t.false(await app.client.isWindowDevToolsOpened());
	t.true(await app.client.isWindowVisible());
	t.true(await app.client.isWindowFocused());
	t.ok(await app.client.getWindowWidth() > 0);
	t.ok(await app.client.getWindowHeight() > 0);
});

test(async t => {
	const app = t.context.app;

	await app.client.waitUntilWindowLoaded(10000);
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
