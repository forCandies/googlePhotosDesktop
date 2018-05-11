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

import {app, Menu, shell} from 'electron';
import Utils from './Utils';


/**
 *
 */
export const createMenu = (): void =>
{
	const template = [
		menuAppTemplate(),
		menuEditTemplate(),
		menuViewTemplate(),
		menuWindowTemplate(),
		menuHelpTemplate()
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
};

/**
 * @returns object
 */
export const menuAppTemplate = (): object =>
{
	return {
		label: app.getName(),
		submenu: [
			{role: 'about'},
			{type: 'separator'},
			{
				label: 'Check for Updates…',
				click()
				{
					require('update-electron-app')({repo: 'forCandies/GooglePhotosDesktop'});
				}
			},
			{role: 'services', submenu: []},
			{type: 'separator'},
			{role: 'hide'},
			{role: 'hideothers'},
			{role: 'unhide'},
			{type: 'separator'},
			{role: 'quit'}
		]
	};
};

/**
 * @returns {object}
 */
export const menuEditTemplate = (): object =>
{
	return {
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'},
			{role: 'pasteandmatchstyle'},
			{role: 'delete'},
			{role: 'selectall'}
		]
	};
};

/**
 * @returns {object}
 */
export const menuViewTemplate = (): object =>
{
	let menu = [
		{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click(_item, window)
			{

				if (!window) {
					return;
				}

				window.reload();
			}
		},
		{type: 'separator'},
		{role: 'togglefullscreen'}
	];

	if (Utils.isDevMode()) {
		menu = menu.concat([
			{
				type: 'separator'
			},
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
				click(_item, window)
				{

					if (!window) {
						return;
					}

					window.webContents.toggleDevTools();
				}
			}
		]);
	}

	return {
		label: 'View',
		submenu: menu
	};
};

/**
 * @returns {object}
 */
export const menuWindowTemplate = (): object =>
{
	return {
		role: 'window',
		submenu: [
			{role: 'minimize'},
			{role: 'close'}
		]
	};
};

/**
 * @returns {object}
 */
export const menuHelpTemplate = (): object =>
{
	return {
		role: 'help',
		submenu: [
			{
				label: 'Visit website…',
				click()
				{
					shell.openExternal('http://googlephotos.forcandies.com');
				}
			},
			{
				label: 'Report Issue…',
				click()
				{
					shell.openExternal('https://github.com/forCandies/GooglePhotosDesktop/issues/new');
				}
			}
		]
	};
};