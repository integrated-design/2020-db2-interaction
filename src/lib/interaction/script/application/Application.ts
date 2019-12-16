///<reference path="../include.ts" />

namespace project {

	import Event = alm.event.Event;
	import DeviceInfo = alm.browser.DeviceInfo;

	export class Application {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(type:string, filePaths:string[]) {
			this.type = type;
			this.filePaths = filePaths;
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		public start():void {
			this.loading = new Loading(jQuery('#loading'), this.type);
			this.loading.addEventListener('playButtonClick', this.playButtonClickHandler);
			this.loading.ready();
			this.loading.show();

			this.videoContainer = new VideoContainer(this.filePaths);
			this.videoContainer.ready();
			this.videoContainer.addEventListener('loadSuccess', this.videoLoadSuccessHandler);
			this.videoContainer.addEventListener('loadError', this.videoLoadErrorHandler);
			this.videoContainer.addEventListener('loadComplete', this.videoLoadCompleteHandler);
			this.videoContainer.addEventListener('loop', this.videoLoopHandler);
			this.videoContainer.load();
		}





		protected showVideo(videoIndex:number):void {
			this.videoContainer.showVideo(videoIndex);
		}

		protected hideVideo(videoIndex:number):void {
			this.videoContainer.hideVideo(videoIndex);
		}

		protected playVideo(videoIndex:number):void {
			this.videoContainer.playVideo(videoIndex);
		}

		protected pauseVideo(videoIndex:number):void {
			this.videoContainer.pauseVideo(videoIndex);
		}

		protected rewindVideo(videoIndex:number):void {
			this.videoContainer.rewindVideo(videoIndex);
		}





		private videoLoadSuccessHandler = (event:Event):void => {
			this.loading.appendMessage('load success : ' + this.filePaths[event.getData()]);
		};

		private videoLoadErrorHandler = (event:Event):void => {
			this.loading.appendMessage('load error : ' + this.filePaths[event.getData()]);
		};

		private videoLoadCompleteHandler = (event:Event):void => {
			this.loading.appendMessage('load complete');
			this.loading.enablePlayButton();
		};

		private videoLoopHandler = (event:Event):void => {
			const videoIndex = event.getData();
			//this.loading.appendMessage('loop : ' + this.filePaths[videoIndex]);
			this.implLoop(videoIndex);
		};

		private playButtonClickHandler = (event:Event):void => {
			this.loading.hide();

			// setup interaction
			if (DeviceInfo.getIsTouchEnabled()) {
				trace('[Application] setup with touch interaction');
				window.addEventListener('touchstart', this.touchStartHandler);
				window.addEventListener('touchend', this.touchEndHandler);
			} else {
				trace('[Application] setup with mouse interaction');
				window.addEventListener('mousedown', this.mouseDownHandler);
				window.addEventListener('mouseup', this.mouseUpHandler);
			}

			// setup init state
			this.videoContainer.show();
			this.implPlay();
		};





		private touchStartHandler = (event:TouchEvent):void => {
			this.implTouchStart();
		};

		private touchEndHandler = (event:TouchEvent):void => {
			this.implTouchEnd();
		};

		private mouseDownHandler = (event:TouchEvent):void => {
			this.implTouchStart();
		};

		private mouseUpHandler = (event:TouchEvent):void => {
			this.implTouchEnd();
		};





		protected implPlay():void {
		}

		protected implTouchStart():void {
		}

		protected implTouchEnd():void {
		}

		protected implLoop(videoIndex:number):void {
		}





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private type:string;
		private filePaths:string[];

		private loading:Loading;
		private videoContainer:VideoContainer;
	}
}
