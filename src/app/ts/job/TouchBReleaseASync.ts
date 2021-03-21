///<reference path="../include.ts" />

namespace project {

	export class TouchBReleaseASync extends Application {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor() {
			super('Touch D / Release C (Sync)', ['c.mp4', 'd.mp4']);
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implPlay():void {
			this.activeVideoIndex = 0;

			// play A
			this.showVideo(0);
			this.playVideo(0);

			// play B in background
			this.playVideo(1);
		}

		protected implTouchStart():void {
			this.activeVideoIndex = 1;

			// hide A
			this.hideVideo(0);

			// show B
			this.showVideo(1);
		}

		protected implTouchEnd():void {
			this.activeVideoIndex = 0;

			// hide B
			this.hideVideo(1);

			// show A
			this.showVideo(0);
		}

		protected implLoop(videoIndex:number):void {
			if (videoIndex == this.activeVideoIndex) {
				this.rewindVideo(1 - videoIndex);
			}
		}





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private activeVideoIndex:number;
	}
}
