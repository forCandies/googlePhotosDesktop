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

import {app, autoUpdater, dialog} from 'electron';
import * as isDev from 'electron-is-dev';
import {format} from 'util';


const pkg = require('../../package.json');
const os = require('os');


/**
 *
 */
class Updater
{

	/**
	 * @type {Updater}
	 */
	private static instance: Updater = new Updater();

	/**
	 * @type {boolean}
	 */
	private isSilentMode: boolean = true;


	/**
	 *
	 */
	constructor()
	{
		if (Updater.instance) {
			throw new Error('Error: Instantiation failed: Use Updater.getInstance() instead of new.');
		}

		if (!isDev) {

			const feedUrl = `https://update.electronjs.org/forCandies/GooglePhotosDesktop/${process.platform}/${app.getVersion()}`;
			const userAgent = format('%s/%s (%s: %s)', pkg.name, pkg.version, os.platform(), os.arch());

			console.log('feedUrl', feedUrl);
			console.log('userAgent', userAgent);

			autoUpdater.setFeedURL({url: feedUrl, headers: {'User-Agent': userAgent}});
			this.create();
		} else {
			console.log('Auto-Updater disabled (dev-mode)');
		}

		Updater.instance = this;
	}


	/**
	 * @param {boolean} isSilentMode
	 */
	public checkForUpdates(isSilentMode: boolean = true): void
	{
		if (isDev) {
			return;
		}

		this.isSilentMode = isSilentMode;
		autoUpdater.checkForUpdates();
	}


	/**
	 *
	 */
	protected create(): void
	{
		autoUpdater.on('error', this.onError.bind(this));
		autoUpdater.on('checking-for-update', this.onCheckingOnUpdate.bind(this));
		autoUpdater.on('update-available', this.onUpdateAvailable.bind(this));
		autoUpdater.on('update-not-available', this.onUpdateNotAvailable.bind(this));
		autoUpdater.on('update-downloaded', this.onUpdateDownloaded.bind(this));

		setInterval(() => this.checkForUpdates(), 60 * 60 * 1000);
	}


	/**
	 * @param {Error} error
	 */
	protected onError(error: Error): void
	{
		console.error('updater error');
		console.error(error);
	}


	/**
	 *
	 */
	protected onCheckingOnUpdate(): void
	{
		console.log('checking-for-update');
	}


	/**
	 *
	 */
	protected onUpdateAvailable(): void
	{
		if (!this.isSilentMode) {
			dialog.showMessageBox({
				type: 'info',
				message: 'A new version of Google Photos is available!',
				detail: 'The new version is being downloaded in the background. Once it is downloaded, you will be notified.'
			});
		}

		console.log('update-available; downloading...');
	}


	/**
	 *
	 */
	protected onUpdateNotAvailable(): void
	{
		if (!this.isSilentMode) {
			dialog.showMessageBox({
				type: 'info',
				message: 'You’re up-to-date!',
				detail: `Google Photos ${app.getVersion()} is currently the newest version available.`
			});
		}

		console.log('update-not-available');
	}


	/**
	 * @param {Event} _
	 * @param {string} releaseNotes
	 * @param {string} releaseName
	 * @param {Date} _releaseDate
	 * @param {String} _updateURL
	 */
	protected onUpdateDownloaded(_: Event, releaseNotes: string, releaseName: string, _releaseDate: Date, _updateURL: String): void
	{
		console.log('update-downloaded', arguments);

		const options = {
			type: 'info',
			buttons: ['Restart', 'Later'],
			title: 'Application Update',
			message: process.platform === 'win32' ? releaseNotes : releaseName,
			detail: 'A new version has been downloaded. Restart the application to apply the updates.'
		};

		dialog.showMessageBox(options, (response) =>
		{
			if (response === 0) {
				autoUpdater.quitAndInstall();
			}
		});
	}


	/**
	 * @returns {Updater}
	 */
	public static getInstance(): Updater
	{
		return Updater.instance;
	}
}


export default Updater;