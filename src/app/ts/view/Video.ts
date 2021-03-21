///<reference path="../include.ts" />

namespace project {

	import View = alm.view.View;

	export class Video extends View<JQuery> {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(videoIndex:number, fileInfo:FileInfo) {
			super();

			this.videoIndex = videoIndex;
			this.fileInfo = fileInfo;

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
			this.player.autoplay = false;
			this.player.loop = false;
			this.player.muted = false;
			this.player.controls = false;
			this.player.setAttribute('playsinline', '');
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
				trace('[Video] show : video index =', this.videoIndex);
				view.css('opacity', 1);
				//view.css('left', '0');
				//view.css('display', 'block');
			});
		}

		protected implHide(view:JQuery, useTransition:boolean):cmd.Command {
			return new cmd.Func(():void => {
				trace('[Video] hide : video index =', this.videoIndex);
				view.css('opacity', 0);
				//view.css('left', '100%');
				//view.css('display', 'none');
			});
		}





		public load():void {
			if (this.isLoading || this.isLoaded) return;
			this.isLoading = true;

			trace('[Video] load start : url =', this.fileInfo.fileName);
			this.player.addEventListener('progress', this.loadProgressHandler);
			this.player.addEventListener('canplaythrough', this.loadCompleteHandler);
			this.player.addEventListener('error', this.loadErrorHandler);
			this.player.addEventListener('ended', this.playerEndedHandler);
			this.player.src = this.fileInfo.fileName + '?' + Date.now();
			this.player.load();
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

		public seekVideo(videoIndex:number, seconds:number):void {
			if (!this.isLoaded) return;

			this.player.currentTime = seconds;
			//this.player.fastSeek(seconds);
		}




		private loadEndAndDispatchEvent(eventType:string):void {
			trace('[Video] load complete : video index =', this.videoIndex);

			this.isLoading = false;
			this.isLoaded = true;

			this.player.removeEventListener('progress', this.loadProgressHandler);
			this.player.removeEventListener('canplaythrough', this.loadCompleteHandler);
			this.player.removeEventListener('error', this.loadErrorHandler);

			this.player.currentTime = 0;

			this.dispatchEvent(new VideoLoadEvent(eventType, this, this.videoIndex, this.fileInfo));
		}





		private loadProgressHandler = (event:ProgressEvent):void => {
			let progressRatio:number = 0;
			if (this.player.buffered.length > 0) {
				progressRatio = (this.player.buffered.end(0) - this.player.buffered.start(0)) / this.player.duration;
			}

			this.dispatchEvent(new VideoLoadProgressEvent(VideoLoadProgressEvent.progress, this, this.videoIndex, this.fileInfo, progressRatio));
		};

		private loadCompleteHandler = ():void => {
			this.loadEndAndDispatchEvent(VideoLoadEvent.complete);
		};

		private loadErrorHandler = ():void => {
			this.loadEndAndDispatchEvent(VideoLoadEvent.error);
		};

		private playerEndedHandler = ():void => {
			this.player.play();
			this.dispatchEvent(new VideoEvent(VideoEvent.loop, this, this.videoIndex, this.fileInfo));
		};





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private videoIndex:number;
		private fileInfo:FileInfo;

		private isLoading:boolean;
		private isLoaded:boolean;
		private isPlaying:boolean;

		private player:HTMLVideoElement;
	}
}
