///<reference path="include.ts" />

namespace project {

	let application:Application = null;

	switch (window['type']) {
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
		application.start();
	}
}
