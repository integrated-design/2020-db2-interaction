/// <reference path="../include.ts" />

module project {

	export class VideoLoadEvent extends alm.event.Event {

		public static readonly complete:string = 'VideoLoadEvent.complete';
		public static readonly error:string = 'VideoLoadEvent.error';





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
