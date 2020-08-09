///<reference path="../include.ts" />

namespace project {

	import View = alm.view.View;

	export class Loading extends View<JQuery> {

		// --------------------------------------------------
		//
		// CONSTRUCTOR
		//
		// --------------------------------------------------

		constructor(view:JQuery, type:string) {
			super(view);

			this.type = type;

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

			this.logField = view.find('#log');
			this.log = '';

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





		public appendMessage(message:string):void {
			this.log += message + '<br>';
			this.logField.html(this.log);
		}

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

		private playButton:JQuery;

		private log:string;
		private logField:JQuery;
	}
}
