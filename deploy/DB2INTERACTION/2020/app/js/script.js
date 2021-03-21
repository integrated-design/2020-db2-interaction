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
    var FileInfo = (function () {
        function FileInfo(data) {
            this.fileName = data['name'] + '.' + data['extension'];
            this.startTime = data['startTime'] || 0;
        }
        return FileInfo;
    }());
    project.FileInfo = FileInfo;
})(project || (project = {}));
var project;
(function (project) {
    var View = alm.view.View;
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading(view, type, fileInfos) {
            var _this = _super.call(this, view) || this;
            _this.playButtonClickHandler = function (event) {
                _this.dispatchEventType('playButtonClick', _this);
            };
            _this.type = type;
            _this.fileInfos = fileInfos;
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
            this.fileLogContainer = view.find('#log');
            this.fileLogFields = [];
            var fileCount = this.fileInfos.length;
            if (fileCount > 0) {
                for (var i = 0; i < fileCount; ++i) {
                    var fileLogField = jQuery('<div>');
                    fileLogField.addClass('file');
                    this.fileLogContainer.append(fileLogField);
                    this.fileLogFields.push(fileLogField);
                    this.updateFileLoadProgress(i, 0);
                }
            }
            else {
                this.fileLogContainer.text('error : no file');
            }
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
        Loading.prototype.updateFileLoadProgress = function (videoIndex, progressRatio) {
            var fileInfo = this.fileInfos[videoIndex];
            var status = '';
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
        function Video(videoIndex, fileInfo) {
            var _this = _super.call(this) || this;
            _this.loadProgressHandler = function (event) {
                var progressRatio = 0;
                if (_this.player.buffered.length > 0) {
                    progressRatio = (_this.player.buffered.end(0) - _this.player.buffered.start(0)) / _this.player.duration;
                }
                _this.dispatchEvent(new project.VideoLoadProgressEvent(project.VideoLoadProgressEvent.progress, _this, _this.videoIndex, _this.fileInfo, progressRatio));
            };
            _this.loadCompleteHandler = function () {
                _this.loadEndAndDispatchEvent(project.VideoLoadEvent.complete);
            };
            _this.loadErrorHandler = function () {
                _this.loadEndAndDispatchEvent(project.VideoLoadEvent.error);
            };
            _this.playerEndedHandler = function () {
                _this.player.play();
                _this.dispatchEvent(new project.VideoEvent(project.VideoEvent.loop, _this, _this.videoIndex, _this.fileInfo));
            };
            _this.videoIndex = videoIndex;
            _this.fileInfo = fileInfo;
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
            var _this = this;
            return new cmd.Func(function () {
                trace('[Video] show : video index =', _this.videoIndex);
                view.css('opacity', 1);
            });
        };
        Video.prototype.implHide = function (view, useTransition) {
            var _this = this;
            return new cmd.Func(function () {
                trace('[Video] hide : video index =', _this.videoIndex);
                view.css('opacity', 0);
            });
        };
        Video.prototype.load = function () {
            if (this.isLoading || this.isLoaded)
                return;
            this.isLoading = true;
            trace('[Video] load start : url =', this.fileInfo.fileName);
            this.player.addEventListener('progress', this.loadProgressHandler);
            this.player.addEventListener('canplaythrough', this.loadCompleteHandler);
            this.player.addEventListener('error', this.loadErrorHandler);
            this.player.addEventListener('ended', this.playerEndedHandler);
            this.player.src = this.fileInfo.fileName + '?' + Date.now();
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
        Video.prototype.seekVideo = function (videoIndex, seconds) {
            if (!this.isLoaded)
                return;
            this.player.currentTime = seconds;
        };
        Video.prototype.loadEndAndDispatchEvent = function (eventType) {
            trace('[Video] load complete : video index =', this.videoIndex);
            this.isLoading = false;
            this.isLoaded = true;
            this.player.removeEventListener('progress', this.loadProgressHandler);
            this.player.removeEventListener('canplaythrough', this.loadCompleteHandler);
            this.player.removeEventListener('error', this.loadErrorHandler);
            this.player.currentTime = 0;
            this.dispatchEvent(new project.VideoLoadEvent(eventType, this, this.videoIndex, this.fileInfo));
        };
        return Video;
    }(View));
    project.Video = Video;
})(project || (project = {}));
var project;
(function (project) {
    var VideoEvent = (function (_super) {
        __extends(VideoEvent, _super);
        function VideoEvent(eventType, target, videoIndex, fileInfo) {
            var _this = _super.call(this, eventType, target) || this;
            _this.videoIndex = videoIndex;
            _this.fileInfo = fileInfo;
            return _this;
        }
        VideoEvent.loop = 'VideoEvent.loop';
        return VideoEvent;
    }(alm.event.Event));
    project.VideoEvent = VideoEvent;
})(project || (project = {}));
var project;
(function (project) {
    var VideoLoadEvent = (function (_super) {
        __extends(VideoLoadEvent, _super);
        function VideoLoadEvent(eventType, target, videoIndex, fileInfo) {
            var _this = _super.call(this, eventType, target) || this;
            _this.videoIndex = videoIndex;
            _this.fileInfo = fileInfo;
            return _this;
        }
        VideoLoadEvent.complete = 'VideoLoadEvent.complete';
        VideoLoadEvent.error = 'VideoLoadEvent.error';
        return VideoLoadEvent;
    }(alm.event.Event));
    project.VideoLoadEvent = VideoLoadEvent;
})(project || (project = {}));
var project;
(function (project) {
    var VideoLoadProgressEvent = (function (_super) {
        __extends(VideoLoadProgressEvent, _super);
        function VideoLoadProgressEvent(eventType, target, videoIndex, fileInfo, progressRatio) {
            var _this = _super.call(this, eventType, target) || this;
            _this.videoIndex = videoIndex;
            _this.fileInfo = fileInfo;
            _this.progressRatio = progressRatio;
            return _this;
        }
        VideoLoadProgressEvent.progress = 'VideoLoadProgressEvent.progress';
        return VideoLoadProgressEvent;
    }(alm.event.Event));
    project.VideoLoadProgressEvent = VideoLoadProgressEvent;
})(project || (project = {}));
var project;
(function (project) {
    var View = alm.view.View;
    var VideoContainer = (function (_super) {
        __extends(VideoContainer, _super);
        function VideoContainer(fileInfos) {
            var _this = _super.call(this, jQuery('#video-container')) || this;
            _this.videoLoadProgressHandler = function (event) {
                _this.dispatchEvent(event);
            };
            _this.videoLoadCompleteHandler = function (event) {
                _this.dispatchEvent(event);
                if (++_this.loadedVideoCount == _this.videoCount) {
                    _this.dispatchEvent(new project.VideoContainerLoadEvent(project.VideoContainerLoadEvent.complete, _this));
                }
            };
            _this.videoLoadErrorHandler = function (event) {
                _this.dispatchEvent(event);
            };
            _this.videoLoopHandler = function (event) {
                _this.dispatchEvent(event);
            };
            _this.fileInfos = fileInfos;
            _this.initialize();
            return _this;
        }
        VideoContainer.prototype.implInitialize = function () {
            var view = this.getView();
            this.videos = [];
            this.videoCount = this.fileInfos.length;
            for (var i = 0; i < this.videoCount; ++i) {
                var video = new project.Video(i, this.fileInfos[i]);
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
                video.addEventListener(project.VideoLoadProgressEvent.progress, this.videoLoadProgressHandler);
                video.addEventListener(project.VideoLoadEvent.complete, this.videoLoadCompleteHandler);
                video.addEventListener(project.VideoLoadEvent.error, this.videoLoadErrorHandler);
                video.addEventListener(project.VideoEvent.loop, this.videoLoopHandler);
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
        VideoContainer.prototype.seekVideo = function (videoIndex, seconds) {
            this.videos[videoIndex].seekVideo(videoIndex, seconds);
        };
        return VideoContainer;
    }(View));
    project.VideoContainer = VideoContainer;
})(project || (project = {}));
var project;
(function (project) {
    var VideoContainerLoadEvent = (function (_super) {
        __extends(VideoContainerLoadEvent, _super);
        function VideoContainerLoadEvent(eventType, target) {
            return _super.call(this, eventType, target) || this;
        }
        VideoContainerLoadEvent.complete = 'VideoContainerLoadEvent.complete';
        VideoContainerLoadEvent.error = 'VideoContainerLoadEvent.error';
        return VideoContainerLoadEvent;
    }(alm.event.Event));
    project.VideoContainerLoadEvent = VideoContainerLoadEvent;
})(project || (project = {}));
var project;
(function (project) {
    var DeviceInfo = alm.browser.DeviceInfo;
    var Application = (function () {
        function Application(type, filePaths) {
            var _this = this;
            this.videoLoadCompleteHandler = function (event) {
                _this.loading.updateFileLoadProgress(event.videoIndex, 1);
            };
            this.videoLoadErrorHandler = function (event) {
                _this.loading.updateFileLoadProgress(event.videoIndex, -1);
            };
            this.videoLoadProgressHandler = function (event) {
                _this.loading.updateFileLoadProgress(event.videoIndex, event.progressRatio);
            };
            this.videoContainerLoadCompleteHandler = function (event) {
                _this.loading.enablePlayButton();
            };
            this.videoLoopHandler = function (event) {
                var videoIndex = event.videoIndex;
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
            this.fileInfos = [];
            var dataList = window['assetInfos'];
            if (dataList) {
                var fileCount = dataList.length;
                for (var i = 0; i < fileCount; ++i) {
                    this.fileInfos.push(new project.FileInfo(dataList[i]));
                }
            }
            else {
                var fileCount = filePaths.length;
                for (var i = 0; i < fileCount; ++i) {
                    this.fileInfos.push(new project.FileInfo({ fileName: filePaths[i] }));
                }
            }
        }
        Application.prototype.run = function () {
            this.loading = new project.Loading(jQuery('#loading'), this.type, this.fileInfos);
            this.loading.addEventListener('playButtonClick', this.playButtonClickHandler);
            this.loading.ready();
            this.loading.show();
            this.videoContainer = new project.VideoContainer(this.fileInfos);
            this.videoContainer.ready();
            this.videoContainer.addEventListener(project.VideoLoadProgressEvent.progress, this.videoLoadProgressHandler);
            this.videoContainer.addEventListener(project.VideoLoadEvent.complete, this.videoLoadCompleteHandler);
            this.videoContainer.addEventListener(project.VideoLoadEvent.error, this.videoLoadErrorHandler);
            this.videoContainer.addEventListener(project.VideoContainerLoadEvent.complete, this.videoContainerLoadCompleteHandler);
            this.videoContainer.addEventListener(project.VideoEvent.loop, this.videoLoopHandler);
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
        Application.prototype.seekVideo = function (videoIndex, seconds) {
            this.videoContainer.seekVideo(videoIndex, seconds);
        };
        Application.prototype.implPlay = function () {
        };
        Application.prototype.implTouchStart = function () {
        };
        Application.prototype.implTouchEnd = function () {
        };
        Application.prototype.implLoop = function (videoIndex) {
        };
        Application.prototype.getFileInfo = function (videoIndex) {
            return this.fileInfos[videoIndex];
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
            var _this = _super.call(this, 'Touch B / Release A (Restart)', ['a.mp4', 'b.mp4']) || this;
            _this.timeoutIdA = -1;
            _this.timeoutIdB = -1;
            return _this;
        }
        TouchBReleaseARewind.prototype.implPlay = function () {
            this.seekVideo(0, this.getFileInfo(0).startTime);
            this.showVideo(0);
            this.playVideo(0);
        };
        TouchBReleaseARewind.prototype.implTouchStart = function () {
            var _this = this;
            window.clearTimeout(this.timeoutIdA);
            this.timeoutIdA = window.setTimeout(function () {
                _this.pauseVideo(0);
                _this.rewindVideo(0);
            }, 50);
            window.clearTimeout(this.timeoutIdB);
            this.showVideo(1);
            this.playVideo(1);
        };
        TouchBReleaseARewind.prototype.implTouchEnd = function () {
            var _this = this;
            window.clearTimeout(this.timeoutIdA);
            this.playVideo(0);
            this.hideVideo(1);
            window.clearTimeout(this.timeoutIdB);
            this.timeoutIdB = window.setTimeout(function () {
                _this.pauseVideo(1);
                _this.rewindVideo(1);
            }, 50);
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
            return _super.call(this, 'Touch D / Release C (Sync)', ['c.mp4', 'd.mp4']) || this;
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
        switch (window['interactionType']) {
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
