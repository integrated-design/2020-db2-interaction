///<reference path="../include.ts" />

namespace project {

	import View = alm.view.View;
	import Event = alm.event.Event;

	export class VideoContainer extends View<JQuery> {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(filePaths:string[]) {
			super(jQuery('#video-container'));

			this.filePaths = filePaths;

			this.initialize();
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implInitialize():JQuery {
			const view = this.getView();

			this.videos = [];
			this.videoCount = this.filePaths.length;
			for (let i = 0; i < this.videoCount; ++i) {
				const video = new Video(i, this.filePaths[i]);
				video.ready();
				view.append(video.getView());
				this.videos.push(video);
			}

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
			this.loadedVideoCount = 0;
			for (let i = 0; i < this.videoCount; ++i) {
				const video = this.videos[i];
				video.addEventListener('loadSuccess', this.videoLoadSuccessHandler);
				video.addEventListener('loadError', this.videoLoadErrorHandler);
				video.addEventListener('loop', this.videoLoopHandler);
				video.load();
			}
		}

		public showVideo(videoIndex:number):void {
			this.videos[videoIndex].show();
		}

		public hideVideo(videoIndex:number):void {
			this.videos[videoIndex].hide();
		}

		public playVideo(videoIndex:number):void {
			this.videos[videoIndex].play();
		}

		public pauseVideo(videoIndex:number):void {
			this.videos[videoIndex].pause();
		}

		public rewindVideo(videoIndex:number):void {
			this.videos[videoIndex].rewind();
		}





		private videoLoadSuccessHandler = (event:Event):void => {
			this.dispatchEventType('loadSuccess', this, event.data);

			if (++this.loadedVideoCount == this.videoCount) {
				this.dispatchEventType('loadComplete', this);
			}
		};

		private videoLoadErrorHandler = (event:Event):void => {
			this.dispatchEventType('loadError', this, event.data);
		};

		private videoLoopHandler = (event:Event):void => {
			this.dispatchEventType('loop', this, event.data);
		};





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private filePaths:string[];

		private videos:Video[];
		private videoCount:number;
		private loadedVideoCount:number;
	}
}
