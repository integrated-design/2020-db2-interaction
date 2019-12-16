///<reference path="../include.ts" />

namespace project {

	export class TouchBReleaseARewind extends Application {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor() {
			super('Touch B & Release A Rewind', ['data/a.mp4', 'data/b.mp4']);
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implPlay():void {
			// play A
			this.showVideo(0);
			this.playVideo(0);
		}

		protected implTouchStart():void {
			// stop A
			this.hideVideo(0);
			this.pauseVideo(0);
			this.rewindVideo(0);

			// play B
			this.showVideo(1);
			this.playVideo(1);
		}

		protected implTouchEnd():void {
			// stop B
			this.hideVideo(1);
			this.pauseVideo(1);
			this.rewindVideo(1);

			// play A
			this.showVideo(0);
			this.playVideo(0);
		}





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------
	}
}
