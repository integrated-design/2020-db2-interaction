///<reference path="../include.ts" />

namespace project {

	export class FileInfo {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(data:object) {
			this.fileName = data['name'] + '.' + data['extension'];
			this.startTime = data['startTime'] || 0;
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		public readonly fileName:string;
		public readonly startTime:number;
	}
}
