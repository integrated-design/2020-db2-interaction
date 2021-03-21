/// <reference path="include.ts" />

namespace project {

	jQuery(document).ready((): void => {
		let application:Application = null;

		switch (window['interactionType']) {
			case 0:
				application = new TouchPlayReleaseStop();
				break;
			case 1:
				application = new TouchBReleaseARewind();
				break;
			case 2:
				application = new TouchBReleaseASync();
				break;
		}

		if (application) {
			application.run();
		}
	});
}
