/// <reference path="../include.ts" />

module project {

	export class VideoContainerLoadEvent extends alm.event.Event {

		public static readonly complete:string = 'VideoContainerLoadEvent.complete';
		public static readonly error:string = 'VideoContainerLoadEvent.error';





		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(eventType:string, target:object) {
			super(eventType, target);
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
	}
}
