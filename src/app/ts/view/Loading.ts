///<reference path="../include.ts" />

namespace project {

	import View = alm.view.View;

	export class Loading extends View<JQuery> {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(view:JQuery, type:string, fileInfos:FileInfo[]) {
			super(view);

			this.type = type;
			this.fileInfos = fileInfos;

			this.initialize();
		}





		// --------------------------------------------------
		//
		// METHOD
		//
		// --------------------------------------------------

		protected implInitialize():JQuery {
			const view = this.getView();

			this.typeField = view.find('#type');
			this.typeField.text(this.type);

			this.playButton = view.find('#play-button');
			this.playButton.addClass('disabled');
			this.playButton.text('LOADING');

			this.fileLogContainer = view.find('#log');
			this.fileLogFields = [];
			const fileCount = this.fileInfos.length;
			if (fileCount > 0) {
				for (let i = 0; i < fileCount; ++i) {
					const fileLogField = jQuery('<div>');
					fileLogField.addClass('file');
					this.fileLogContainer.append(fileLogField);
					this.fileLogFields.push(fileLogField);
					this.updateFileLoadProgress(i, 0);
				}
			} else {
				this.fileLogContainer.text('error : no file');
			}

			//Logger.logger = new DOMLogging(this.logField.get(0), true);

			return view;
		}

		protected implReady():void {
		}

		protected implFinalize():void {
		}


		protected implShow(view:JQuery, useTransition:boolean):cmd.Command {
			return new cmd.Func(():void => {
				view.css('display', 'block');
			});
		}

		protected implHide(view:JQuery, useTransition:boolean):cmd.Command {
			return new cmd.Func(():void => {
				view.css('display', 'none');
			});
		}





		public updateFileLoadProgress(videoIndex:number, progressRatio:number):void {
			const fileInfo = this.fileInfos[videoIndex];

			let status = '';
			switch (progressRatio) {
				case -1:
					status = 'load error';
					break;
				case 1:
					status = 'load complete';
					break;
				case 0:
					status = 'loading';
					break;
				default:
					status = Math.floor(progressRatio * 100) + '%';
					break;
			}
			this.fileLogFields[videoIndex].text(fileInfo.fileName + ' : ' + status);
		}

		//public appendMessage(message:string):void {
		//	this.log += message + '<br>';
		//	this.logField.html(this.log);
		//}

		public enablePlayButton():void {
			this.playButton.text('START');
			this.playButton.removeClass('disabled');
			this.playButton.on('click', this.playButtonClickHandler);
		}





		private playButtonClickHandler = (event:JQuery.ClickEvent):void => {
			this.dispatchEventType('playButtonClick', this);
		};





		// --------------------------------------------------
		//
		// MEMBER
		//
		// --------------------------------------------------

		private type:string;
		private typeField:JQuery;

		private fileInfos:FileInfo[];
		private fileLogContainer:JQuery;
		private fileLogFields:JQuery[];

		private playButton:JQuery;
	}
}
