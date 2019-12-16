///<reference path="../include.ts" />

namespace project {

	export class TouchPlayReleaseStop extends Application {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor() {
			super('Touch Play & Release Stop', ['data/a.mp4']);
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implPlay():void {
			// show A
			this.showVideo(0);
		}

		protected implTouchStart():void {
			// play A
			this.playVideo(0);
		}

		protected implTouchEnd():void {
			// pause A
			this.pauseVideo(0);
		}





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------
	}
}
