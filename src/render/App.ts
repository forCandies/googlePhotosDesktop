/*
 * Copyright 2018 forCandies <work@forcandies.com> (http://forcandies.com)
 *
 * ISC License
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose with or without fee is hereby granted, provided
 * that the above copyright notice and this permission notice appear
 * in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 * THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 * NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import {ipcRenderer} from 'electron';


/**
 * @type {HTMLElement}
 */
const statusBar: HTMLElement = document.getElementById('StatusBar') || new HTMLElement();

/**
 * @type {HTMLElement}
 */
const webView: HTMLElement = document.getElementById('App') || new HTMLElement();

/**
 *
 */
webView.addEventListener('did-navigate-in-page', (event: Event) =>
{
	const url: string = (event as any).url;
	const statusBarList = statusBar.classList;

	if (url.includes('notifications.google.com')) {
		return;
	}

	statusBarList.remove('StatusBar--search');
	statusBarList.remove('StatusBar--detail');
	statusBarList.remove('StatusBar--assistant');

	if (url.includes('/search')) {
		statusBarList.add('StatusBar--search');
	}

	if (url.includes('/photo/')) {
		statusBarList.add('StatusBar--detail');
	}

	if (url.includes('/share')) {
		statusBarList.add('StatusBar--white');
	}
});

/**
 *
 */
ipcRenderer.on('window:fullScreen', (_event: Event, data: any) =>
{
	if (data.isFullScreenMode) {
		statusBar.classList.add('StatusBar--hidden');
		webView.classList.add('App--noStatusBar');
		return;
	}

	statusBar.classList.remove('StatusBar--hidden');
	webView.classList.remove('App--noStatusBar');
});