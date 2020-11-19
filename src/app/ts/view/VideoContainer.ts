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

		constructor(fileInfos:FileInfo[]) {
			super(jQuery('#video-container'));

			this.fileInfos = fileInfos;

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
			this.videoCount = this.fileInfos.length;
			for (let i = 0; i < this.videoCount; ++i) {
				const video = new Video(i, this.fileInfos[i]);
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
				video.addEventListener(VideoLoadProgressEvent.progress, this.videoLoadProgressHandler);
				video.addEventListener(VideoLoadEvent.complete, this.videoLoadCompleteHandler);
				video.addEventListener(VideoLoadEvent.error, this.videoLoadErrorHandler);
				video.addEventListener(VideoEvent.loop, this.videoLoopHandler);
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

		public seekVideo(videoIndex:number, seconds:number):void {
			this.videos[videoIndex].seekVideo(videoIndex, seconds);
		}





		private videoLoadProgressHandler = (event:VideoLoadProgressEvent):void => {
			// propagating video event
			this.dispatchEvent(event);
		};

		private videoLoadCompleteHandler = (event:VideoLoadEvent):void => {
			// propagating video event
			this.dispatchEvent(event);

			// loaded all
			if (++this.loadedVideoCount == this.videoCount) {
				this.dispatchEvent(new VideoContainerLoadEvent(VideoContainerLoadEvent.complete, this));
			}
		};

		private videoLoadErrorHandler = (event:VideoLoadEvent):void => {
			// propagating video event
			this.dispatchEvent(event);
		};

		private videoLoopHandler = (event:VideoEvent):void => {
			// propagating video event
			this.dispatchEvent(event);
		};





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private fileInfos:FileInfo[];

		private videos:Video[];
		private videoCount:number;
		private loadedVideoCount:number;
	}
}
