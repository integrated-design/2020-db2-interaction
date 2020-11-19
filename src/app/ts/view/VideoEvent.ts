/// <reference path="../include.ts" />

module project {

	export class VideoEvent extends alm.event.Event {

		public static readonly loop:string = 'VideoEvent.loop';





		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(eventType:string, target:object, videoIndex:number, fileInfo:FileInfo) {
			super(eventType, target);
			this.videoIndex = videoIndex;
			this.fileInfo = fileInfo;
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------





		// --------------------------------------------------
		//
		// VARIABLE
		//
		// --------------------------------------------------

		public readonly videoIndex:number;
		public readonly fileInfo:FileInfo;
	}
}
