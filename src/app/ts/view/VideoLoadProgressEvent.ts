/// <reference path="../include.ts" />

module project {

	import FileInfo = project.FileInfo;

	export class VideoLoadProgressEvent extends alm.event.Event {

		public static readonly progress:string = 'VideoLoadProgressEvent.progress';





		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(eventType:string, target:object, videoIndex:number, fileInfo:FileInfo, progressRatio:number) {
			super(eventType, target);
			this.videoIndex = videoIndex;
			this.fileInfo = fileInfo;
			this.progressRatio = progressRatio;
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
		public readonly progressRatio:number;
	}
}
