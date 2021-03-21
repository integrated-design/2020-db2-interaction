///<reference path="../include.ts" />

namespace project {

	export class TouchBReleaseARewind extends Application {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor() {
			super('Touch B / Release A (Restart)', ['a.mp4', 'b.mp4']);

			this.timeoutIdA = -1;
			this.timeoutIdB = -1;
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implPlay():void {
			// A
			this.seekVideo(0, this.getFileInfo(0).startTime);
			this.showVideo(0);
			this.playVideo(0);
		}

		protected implTouchStart():void {
			// A
			window.clearTimeout(this.timeoutIdA);
			this.timeoutIdA = window.setTimeout(():void => {
				this.pauseVideo(0);
				this.rewindVideo(0);
			}, 50);

			// B
			window.clearTimeout(this.timeoutIdB);
			this.showVideo(1);
			this.playVideo(1);
		}

		protected implTouchEnd():void {
			// A
			window.clearTimeout(this.timeoutIdA);
			this.playVideo(0);

			// B
			this.hideVideo(1);
			window.clearTimeout(this.timeoutIdB);
			this.timeoutIdB = window.setTimeout(():void => {
				this.pauseVideo(1);
				this.rewindVideo(1);
			}, 50);
		}





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private timeoutIdA:number;
		private timeoutIdB:number;
	}
}
