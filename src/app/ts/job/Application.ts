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
			this.fileInfos = [];

			const dataList = window['assetInfos'];
			if (dataList) {
				const fileCount = dataList.length;
				for (let i = 0; i < fileCount; ++i) {
					this.fileInfos.push(new FileInfo(dataList[i]));
				}
			} else {
				const fileCount = filePaths.length;
				for (let i = 0; i < fileCount; ++i) {
					this.fileInfos.push(new FileInfo({ fileName: filePaths[i] }));
				}
			}
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		public run():void {
			this.loading = new Loading(jQuery('#loading'), this.type, this.fileInfos);
			this.loading.addEventListener('playButtonClick', this.playButtonClickHandler);
			this.loading.ready();
			this.loading.show();

			this.videoContainer = new VideoContainer(this.fileInfos);
			this.videoContainer.ready();
			this.videoContainer.addEventListener(VideoLoadProgressEvent.progress, this.videoLoadProgressHandler);
			this.videoContainer.addEventListener(VideoLoadEvent.complete, this.videoLoadCompleteHandler);
			this.videoContainer.addEventListener(VideoLoadEvent.error, this.videoLoadErrorHandler);
			this.videoContainer.addEventListener(VideoContainerLoadEvent.complete, this.videoContainerLoadCompleteHandler);
			this.videoContainer.addEventListener(VideoEvent.loop, this.videoLoopHandler);
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

		protected seekVideo(videoIndex:number, seconds:number):void {
			this.videoContainer.seekVideo(videoIndex, seconds);
		}





		private videoLoadCompleteHandler = (event:VideoLoadEvent):void => {
			this.loading.updateFileLoadProgress(event.videoIndex, 1);
			//this.loading.appendMessage('load complete : ' + event.fileInfo.fileName);
		};

		private videoLoadErrorHandler = (event:VideoLoadEvent):void => {
			this.loading.updateFileLoadProgress(event.videoIndex, -1);
			//this.loading.appendMessage('load error : ' + event.fileInfo.fileName);
		};

		private videoLoadProgressHandler = (event:VideoLoadProgressEvent):void => {
			this.loading.updateFileLoadProgress(event.videoIndex, event.progressRatio);
			//this.loading.appendMessage('load progress : ' + this.fileInfos[event.data].fileName);
		};

		private videoContainerLoadCompleteHandler = (event:VideoContainerLoadEvent):void => {
			//this.loading.appendMessage('load complete all');
			this.loading.enablePlayButton();
		};

		private videoLoopHandler = (event:VideoEvent):void => {
			const videoIndex = event.videoIndex;
			this.implLoop(videoIndex);
		};

		private playButtonClickHandler = (event:Event):void => {
			this.loading.hide();

			// set fullscreen
			trace('[Application] fullscreen capability :', screenfull.isEnabled);
			if (screenfull.isEnabled) {
				screenfull['request']();
			}

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

			window.addEventListener('contextmenu', this.contextMenuHandler);

			// setup init state
			this.videoContainer.show();
			this.implPlay();
		};





		private touchStartHandler = (event:TouchEvent):void => {
			event.preventDefault();
			event.stopPropagation();

			this.implTouchStart();
		};

		private touchEndHandler = (event:TouchEvent):void => {
			event.preventDefault();
			event.stopPropagation();

			this.implTouchEnd();
		};

		private mouseDownHandler = (event:TouchEvent):void => {
			event.preventDefault();
			event.stopPropagation();

			this.implTouchStart();
		};

		private mouseUpHandler = (event:TouchEvent):void => {
			event.preventDefault();
			event.stopPropagation();

			this.implTouchEnd();
		};

		private contextMenuHandler = (event:any):void => {
			event.preventDefault();
			event.stopPropagation();
		};





		protected implPlay():void {
		}

		protected implTouchStart():void {
		}

		protected implTouchEnd():void {
		}

		protected implLoop(videoIndex:number):void {
		}




		public getFileInfo(videoIndex:number):FileInfo {
			return this.fileInfos[videoIndex];
		}





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private type:string;
		private fileInfos:FileInfo[];

		private loading:Loading;
		private videoContainer:VideoContainer;
	}
}
