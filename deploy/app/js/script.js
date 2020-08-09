var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var project;
(function (project) {
    var View = alm.view.View;
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading(view, type) {
            var _this = _super.call(this, view) || this;
            _this.playButtonClickHandler = function (event) {
                _this.dispatchEventType('playButtonClick', _this);
            };
            _this.type = type;
            _this.initialize();
            return _this;
        }
        Loading.prototype.implInitialize = function () {
            var view = this.getView();
            this.typeField = view.find('#type');
            this.typeField.text(this.type);
            this.playButton = view.find('#play-button');
            this.playButton.addClass('disabled');
            this.playButton.text('LOADING');
            this.logField = view.find('#log');
            this.log = '';
            return view;
        };
        Loading.prototype.implReady = function () {
        };
        Loading.prototype.implFinalize = function () {
        };
        Loading.prototype.implShow = function (view, useTransition) {
            return new cmd.Func(function () {
                view.css('display', 'block');
            });
        };
        Loading.prototype.implHide = function (view, useTransition) {
            return new cmd.Func(function () {
                view.css('display', 'none');
            });
        };
        Loading.prototype.appendMessage = function (message) {
            this.log += message + '<br>';
            this.logField.html(this.log);
        };
        Loading.prototype.enablePlayButton = function () {
            this.playButton.text('START');
            this.playButton.removeClass('disabled');
            this.playButton.on('click', this.playButtonClickHandler);
        };
        return Loading;
    }(View));
    project.Loading = Loading;
})(project || (project = {}));
var project;
(function (project) {
    var View = alm.view.View;
    var Video = (function (_super) {
        __extends(Video, _super);
        function Video(videoIndex, filePath) {
            var _this = _super.call(this) || this;
            _this.loadSuccessHandler = function () {
                _this.loadEndAndDispatchEvent('loadSuccess');
            };
            _this.loadErrorHandler = function () {
                _this.loadEndAndDispatchEvent('loadError');
            };
            _this.playerEndedHandler = function () {
                _this.player.play();
                _this.dispatchEventType('loop', _this, _this.videoIndex);
            };
            _this.videoIndex = videoIndex;
            _this.filePath = filePath;
            _this.initialize();
            return _this;
        }
        Video.prototype.implInitialize = function () {
            var view = jQuery('<div>');
            view.addClass('video');
            this.player = document.createElement('video');
            this.player.autoplay = false;
            this.player.loop = false;
            this.player.muted = false;
            this.player.controls = false;
            this.player.setAttribute('playsinline', '');
            view.append(jQuery(this.player));
            this.isLoading = false;
            this.isLoaded = false;
            this.isPlaying = false;
            return view;
        };
        Video.prototype.implReady = function () {
        };
        Video.prototype.implFinalize = function () {
        };
        Video.prototype.implShow = function (view, useTransition) {
            return new cmd.Func(function () {
                view.css('display', 'block');
            });
        };
        Video.prototype.implHide = function (view, useTransition) {
            return new cmd.Func(function () {
                view.css('display', 'none');
            });
        };
        Video.prototype.load = function () {
            if (this.isLoading || this.isLoaded)
                return;
            this.isLoading = true;
            trace('[Video] load start : url =', this.filePath);
            this.player.oncanplay = this.loadSuccessHandler;
            this.player.onerror = this.loadErrorHandler;
            this.player.onended = this.playerEndedHandler;
            this.player.src = this.filePath + '?' + Date.now();
            this.player.load();
        };
        Video.prototype.play = function () {
            if (!this.isLoaded || this.isPlaying)
                return;
            this.isPlaying = true;
            this.player.play();
        };
        Video.prototype.pause = function () {
            if (!this.isLoaded || !this.isPlaying)
                return;
            this.isPlaying = false;
            this.player.pause();
        };
        Video.prototype.rewind = function () {
            if (!this.isLoaded)
                return;
            this.player.currentTime = 0;
        };
        Video.prototype.loadEndAndDispatchEvent = function (eventType) {
            trace('[Video] load complete : video index =', this.videoIndex);
            this.isLoading = false;
            this.isLoaded = true;
            this.player.oncanplay = null;
            this.player.onerror = null;
            this.dispatchEventType(eventType, this, this.videoIndex);
        };
        return Video;
    }(View));
    project.Video = Video;
})(project || (project = {}));
var project;
(function (project) {
    var View = alm.view.View;
    var VideoContainer = (function (_super) {
        __extends(VideoContainer, _super);
        function VideoContainer(filePaths) {
            var _this = _super.call(this, jQuery('#video-container')) || this;
            _this.videoLoadSuccessHandler = function (event) {
                _this.dispatchEventType('loadSuccess', _this, event.data);
                if (++_this.loadedVideoCount == _this.videoCount) {
                    _this.dispatchEventType('loadComplete', _this);
                }
            };
            _this.videoLoadErrorHandler = function (event) {
                _this.dispatchEventType('loadError', _this, event.data);
            };
            _this.videoLoopHandler = function (event) {
                _this.dispatchEventType('loop', _this, event.data);
            };
            _this.filePaths = filePaths;
            _this.initialize();
            return _this;
        }
        VideoContainer.prototype.implInitialize = function () {
            var view = this.getView();
            this.videos = [];
            this.videoCount = this.filePaths.length;
            for (var i = 0; i < this.videoCount; ++i) {
                var video = new project.Video(i, this.filePaths[i]);
                video.ready();
                view.append(video.getView());
                this.videos.push(video);
            }
            return view;
        };
        VideoContainer.prototype.implReady = function () {
        };
        VideoContainer.prototype.implFinalize = function () {
        };
        VideoContainer.prototype.implShow = function (view, useTransition) {
            return new cmd.Func(function () {
                view.css('display', 'block');
            });
        };
        VideoContainer.prototype.implHide = function (view, useTransition) {
            return new cmd.Func(function () {
                view.css('display', 'none');
            });
        };
        VideoContainer.prototype.load = function () {
            this.loadedVideoCount = 0;
            for (var i = 0; i < this.videoCount; ++i) {
                var video = this.videos[i];
                video.addEventListener('loadSuccess', this.videoLoadSuccessHandler);
                video.addEventListener('loadError', this.videoLoadErrorHandler);
                video.addEventListener('loop', this.videoLoopHandler);
                video.load();
            }
        };
        VideoContainer.prototype.showVideo = function (videoIndex) {
            this.videos[videoIndex].show();
        };
        VideoContainer.prototype.hideVideo = function (videoIndex) {
            this.videos[videoIndex].hide();
        };
        VideoContainer.prototype.playVideo = function (videoIndex) {
            this.videos[videoIndex].play();
        };
        VideoContainer.prototype.pauseVideo = function (videoIndex) {
            this.videos[videoIndex].pause();
        };
        VideoContainer.prototype.rewindVideo = function (videoIndex) {
            this.videos[videoIndex].rewind();
        };
        return VideoContainer;
    }(View));
    project.VideoContainer = VideoContainer;
})(project || (project = {}));
var project;
(function (project) {
    var DeviceInfo = alm.browser.DeviceInfo;
    var Application = (function () {
        function Application(type, filePaths) {
            var _this = this;
            this.videoLoadSuccessHandler = function (event) {
                _this.loading.appendMessage('load success : ' + _this.filePaths[event.data]);
            };
            this.videoLoadErrorHandler = function (event) {
                _this.loading.appendMessage('load error : ' + _this.filePaths[event.data]);
            };
            this.videoLoadCompleteHandler = function (event) {
                _this.loading.appendMessage('load complete');
                _this.loading.enablePlayButton();
            };
            this.videoLoopHandler = function (event) {
                var videoIndex = event.data;
                _this.implLoop(videoIndex);
            };
            this.playButtonClickHandler = function (event) {
                _this.loading.hide();
                trace('[Application] fullscreen capability :', screenfull.isEnabled);
                if (screenfull.isEnabled) {
                    screenfull['request']();
                }
                if (DeviceInfo.getIsTouchEnabled()) {
                    trace('[Application] setup with touch interaction');
                    window.addEventListener('touchstart', _this.touchStartHandler);
                    window.addEventListener('touchend', _this.touchEndHandler);
                }
                else {
                    trace('[Application] setup with mouse interaction');
                    window.addEventListener('mousedown', _this.mouseDownHandler);
                    window.addEventListener('mouseup', _this.mouseUpHandler);
                }
                window.addEventListener('contextmenu', _this.contextMenuHandler);
                _this.videoContainer.show();
                _this.implPlay();
            };
            this.touchStartHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.implTouchStart();
            };
            this.touchEndHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.implTouchEnd();
            };
            this.mouseDownHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.implTouchStart();
            };
            this.mouseUpHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.implTouchEnd();
            };
            this.contextMenuHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
            };
            this.type = type;
            this.filePaths = filePaths;
        }
        Application.prototype.run = function () {
            this.loading = new project.Loading(jQuery('#loading'), this.type);
            this.loading.addEventListener('playButtonClick', this.playButtonClickHandler);
            this.loading.ready();
            this.loading.show();
            this.videoContainer = new project.VideoContainer(this.filePaths);
            this.videoContainer.ready();
            this.videoContainer.addEventListener('loadSuccess', this.videoLoadSuccessHandler);
            this.videoContainer.addEventListener('loadError', this.videoLoadErrorHandler);
            this.videoContainer.addEventListener('loadComplete', this.videoLoadCompleteHandler);
            this.videoContainer.addEventListener('loop', this.videoLoopHandler);
            this.videoContainer.load();
        };
        Application.prototype.showVideo = function (videoIndex) {
            this.videoContainer.showVideo(videoIndex);
        };
        Application.prototype.hideVideo = function (videoIndex) {
            this.videoContainer.hideVideo(videoIndex);
        };
        Application.prototype.playVideo = function (videoIndex) {
            this.videoContainer.playVideo(videoIndex);
        };
        Application.prototype.pauseVideo = function (videoIndex) {
            this.videoContainer.pauseVideo(videoIndex);
        };
        Application.prototype.rewindVideo = function (videoIndex) {
            this.videoContainer.rewindVideo(videoIndex);
        };
        Application.prototype.implPlay = function () {
        };
        Application.prototype.implTouchStart = function () {
        };
        Application.prototype.implTouchEnd = function () {
        };
        Application.prototype.implLoop = function (videoIndex) {
        };
        return Application;
    }());
    project.Application = Application;
})(project || (project = {}));
var project;
(function (project) {
    var TouchBReleaseARewind = (function (_super) {
        __extends(TouchBReleaseARewind, _super);
        function TouchBReleaseARewind() {
            return _super.call(this, 'Touch B & Release A - Rewind', ['a.mp4', 'b.mp4']) || this;
        }
        TouchBReleaseARewind.prototype.implPlay = function () {
            this.showVideo(0);
            this.playVideo(0);
        };
        TouchBReleaseARewind.prototype.implTouchStart = function () {
            this.hideVideo(0);
            this.pauseVideo(0);
            this.rewindVideo(0);
            this.showVideo(1);
            this.playVideo(1);
        };
        TouchBReleaseARewind.prototype.implTouchEnd = function () {
            this.hideVideo(1);
            this.pauseVideo(1);
            this.rewindVideo(1);
            this.showVideo(0);
            this.playVideo(0);
        };
        return TouchBReleaseARewind;
    }(project.Application));
    project.TouchBReleaseARewind = TouchBReleaseARewind;
})(project || (project = {}));
var project;
(function (project) {
    var TouchBReleaseASync = (function (_super) {
        __extends(TouchBReleaseASync, _super);
        function TouchBReleaseASync() {
            return _super.call(this, 'Touch B & Release A - Sync', ['a.mp4', 'b.mp4']) || this;
        }
        TouchBReleaseASync.prototype.implPlay = function () {
            this.activeVideoIndex = 0;
            this.showVideo(0);
            this.playVideo(0);
            this.playVideo(1);
        };
        TouchBReleaseASync.prototype.implTouchStart = function () {
            this.activeVideoIndex = 1;
            this.hideVideo(0);
            this.showVideo(1);
        };
        TouchBReleaseASync.prototype.implTouchEnd = function () {
            this.activeVideoIndex = 0;
            this.hideVideo(1);
            this.showVideo(0);
        };
        TouchBReleaseASync.prototype.implLoop = function (videoIndex) {
            if (videoIndex == this.activeVideoIndex) {
                this.rewindVideo(1 - videoIndex);
            }
        };
        return TouchBReleaseASync;
    }(project.Application));
    project.TouchBReleaseASync = TouchBReleaseASync;
})(project || (project = {}));
var project;
(function (project) {
    var TouchPlayReleaseStop = (function (_super) {
        __extends(TouchPlayReleaseStop, _super);
        function TouchPlayReleaseStop() {
            return _super.call(this, 'Touch Play & Release Stop', ['a.mp4']) || this;
        }
        TouchPlayReleaseStop.prototype.implPlay = function () {
            this.showVideo(0);
        };
        TouchPlayReleaseStop.prototype.implTouchStart = function () {
            this.playVideo(0);
        };
        TouchPlayReleaseStop.prototype.implTouchEnd = function () {
            this.pauseVideo(0);
        };
        return TouchPlayReleaseStop;
    }(project.Application));
    project.TouchPlayReleaseStop = TouchPlayReleaseStop;
})(project || (project = {}));
var project;
(function (project) {
    jQuery(document).ready(function () {
        var application = null;
        switch (window['type']) {
            case 0:
                application = new project.TouchPlayReleaseStop();
                break;
            case 1:
                application = new project.TouchBReleaseARewind();
                break;
            case 2:
                application = new project.TouchBReleaseASync();
                break;
        }
        if (application) {
            application.run();
        }
    });
})(project || (project = {}));

//# sourceMappingURL=script.js.map
