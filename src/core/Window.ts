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

import {BrowserWindow} from 'electron';
import installExtension, {
	REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import * as windowStateKeeper from 'electron-window-state';
import {createMenu} from './Menu';
import Utils from './Utils';


/**
 *
 */
class Window extends BrowserWindow
{

	/**
	 *
	 */
	constructor()
	{
		const state = Window.getState();
		const properties = {
			title: 'Google Photos',
			minHeight: 420,
			minWidth: 420,
			width: state.width,
			height: state.height,
			x: state.x,
			y: state.y,
			backgroundColor: '#eeeeee',
			titleBarStyle: 'hidden',
			show: false
		};

		super(properties as any);

		this.once('ready-to-show', () => this.show());

		this.create().then();
		this.createListeners();

		state.manage(this);
		createMenu();
	}


	/**
	 *
	 */
	public destroy(): void
	{
		this.removeListeners();
		super.destroy();
	}


	/**
	 * @returns {Promise<void>}
	 */
	protected async create(): Promise<void>
	{
		this.loadURL(Window.getUrl());

		if (Utils.isDevMode()) {
			await installExtension(REACT_DEVELOPER_TOOLS);
		}
	}


	/**
	 *
	 */
	protected createListeners(): void
	{
		this.on('enter-full-screen', () => this.sendFullScreenMode(true));
		this.on('leave-full-screen', () => this.sendFullScreenMode(false));
	}


	/**
	 *
	 */
	protected removeListeners(): void
	{
		this.removeListener('enter-full-screen', () => this.sendFullScreenMode(true));
		this.removeListener('leave-full-screen', () => this.sendFullScreenMode(false));
	}


	/**
	 * @param {boolean} isFullScreenMode
	 */
	protected sendFullScreenMode(isFullScreenMode: boolean): void
	{
		this.webContents.send('window:fullscreen', {
			'isFullScreenMode': isFullScreenMode
		});
	}


	/**
	 * @returns {string}
	 */
	protected static getUrl(): string
	{
		return `file://${__dirname}/../html/app.html`;
	}


	/**
	 * @returns {any}
	 */
	protected static getState(): any
	{
		return windowStateKeeper({
			defaultWidth: 1024,
			defaultHeight: 768
		});
	}
}


export default Window;