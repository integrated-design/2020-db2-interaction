///<reference path="../include.ts" />

namespace project {

	import View = alm.view.View;

	export class Video extends View<JQuery> {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(videoIndex:number, filePath:string) {
			super();

			this.videoIndex = videoIndex;
			this.filePath = filePath;

			this.initialize();
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implInitialize():JQuery {
			const view = jQuery('<div>');
			view.addClass('video');

			this.player = document.createElement('video');
			view.append(jQuery(this.player));

			this.isLoading = false;
			this.isLoaded = false;
			this.isPlaying = false;

			return view;
		}

		protected implReady():void {
		}

		protected implFinalize():void {
		}


		protected implShow(view:JQuery, useTransition:boolean):cmd.Command {
			return new cmd.Func(():void => {
				view.css('display', 'block');
			});
		}

		protected implHide(view:JQuery, useTransition:boolean):cmd.Command {
			return new cmd.Func(():void => {
				view.css('display', 'none');
			});
		}





		public load():void {
			if (this.isLoading || this.isLoaded) return;
			this.isLoading = true;

			trace('[Video] load start : url =', this.filePath);

			this.player.autoplay = false;
			this.player.loop = false;
			this.player.muted = false;
			this.player.oncanplay = this.loadSuccessHandler;
			this.player.onerror = this.loadErrorHandler;
			this.player.onended = this.playerEndedHandler;
			this.player.src = this.filePath + '?' + Date.now();
		}

		public play():void {
			if (!this.isLoaded || this.isPlaying) return;
			this.isPlaying = true;

			this.player.play();
		}

		public pause():void {
			if (!this.isLoaded || !this.isPlaying) return;
			this.isPlaying = false;

			this.player.pause();
		}

		public rewind():void {
			if (!this.isLoaded) return;

			this.player.currentTime = 0;
		}





		private loadEndAndDispatchEvent(eventType:string):void {
			trace('[Video] load complete : video index =', this.videoIndex);

			this.isLoading = false;
			this.isLoaded = true;

			this.player.oncanplay = null;
			this.player.onerror = null;

			this.dispatchEventType(eventType, this,  this.videoIndex);
		}





		private loadSuccessHandler = ():void => {
			this.loadEndAndDispatchEvent('loadSuccess');
		};

		private loadErrorHandler = ():void => {
			this.loadEndAndDispatchEvent('loadError');
		};

		private playerEndedHandler = ():void => {
			this.player.play();
			this.dispatchEventType('loop', this,  this.videoIndex);
		};





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private videoIndex:number;
		private filePath:string;

		private isLoading:boolean;
		private isLoaded:boolean;
		private isPlaying:boolean;
		private player:HTMLVideoElement;
	}
}
