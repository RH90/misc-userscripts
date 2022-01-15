// ==UserScript==
// @name         Replay
// @namespace    http://tampermonkey.net/
// @version      19.5
// @description  try to take over the world!
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @run-at document-end
// @downloadURL  https://github.com/RH90/misc-userscripts/raw/master/Replay.user.js
// @noframes
// ==/UserScript==
var yt;
var sliderStop;
var sliderStart;
var sliderHidden;
var textStart;
var textStop;
var valueStart;
var valueStop;
var max;
var sliderSelect = 0;
var frame;
var div;
var linkTest = "";
var buttonMP3;
var buttonChat;
var infoPanel;
var divRepeat;
var init = setInterval(Init, 500);

var replayCheck = false;

var styleLive;
var fullscreenLive = false;
var isLiveStream = false;
var onOffLive = true;
var chatNode;
var checkTheaterMode;

function Init() {
	yt = document.getElementById("movie_player");
	frame = document.querySelector('[id="primary-inner"] [id="player"]');
	infoPanel = document.querySelector("#info-contents .style-scope.ytd-watch-flexy");
	// console.log(yt.getVideoData().video_id);
	if (infoPanel && frame && yt && yt.getVideoData() && yt.getVideoData().video_id) {
		infoPanel.style.paddingTop = "0px";
		var style = document.createElement("style");
		style.innerHTML = `
		.slider::-webkit-slider-thumb, .slider-front::-webkit-slider-thumb{
			-webkit-appearance: none;
			appearance: none;
			width: 12px;
			border-radius: 15%;
			height: 25px;
			cursor: pointer;
			border: 1px solid black;
		}
		.slider{
			background: transparent;
		}
		.slider::-webkit-slider-thumb{
			background: DodgerBlue;
		}
		.slider-front::-webkit-slider-thumb{
			background: #ff4337;
		}
		.slider-front{
			background: FloralWhite;
		}
		.slider, .slider-front{
			-webkit-appearance: none;
			height: 8px;
		}
		`;
		document.body.appendChild(style);

		textStart = document.createElement("INPUT");
		textStart.setAttribute("type", "text");
		textStart.setAttribute(
			"style",
			"width:40px;margin-left:5px;bottom: 3px;border-radius: 4px;color:white;background:black;border-width:1px;text-align: center;"
		);
		textStart.style.font = "11px consolas";

		textStop = document.createElement("INPUT");
		textStop.setAttribute("type", "text");
		textStop.setAttribute(
			"style",
			"width:40px;bottom: 3px;border-radius: 4px;color:white;background:black;border-width:1px;text-align: center;"
		);
		textStop.style.font = "11px consolas";

		var slider = sliderElement();

		buttonMP3 = document.createElement("button");
		buttonMP3.setAttribute(
			"style",
			"color:white;background:black;border-radius: 5px;padding:2px ;padding-right: 15px;padding-left: 15px;"
		);
		buttonMP3.appendChild(document.createTextNode("MP3"));
		buttonMP3.style.fontSize = "10px";

		buttonMP3.onclick = function () {
			var downloadLink;
			var ytNow = document.getElementById("movie_player");
			if (ytNow) {
				var title = document.querySelector("title").innerHTML;
				title = title.replace(" - YouTube", "");

				var max = parseInt(yt.getDuration());
				var videoId = ytNow.getVideoData().video_id;
				if (title && max && videoId) {
					downloadLink = true;
					fetch(
						`http://127.0.0.1:8088/V/?link=${videoId}&title=${encodeURIComponent(title)}&seconds=${max}`,
						{ method: "GET", cors: "no-cors" }
					);
				}
			}
			if (!downloadLink) {
				return;
			}

			buttonMP3.disabled = true;
			buttonMP3.style.color = "gray";
		};
		var checkBoxChat = document.createElement("input");
		checkBoxChat.setAttribute("type", "checkbox");

		buttonChat = document.createElement("button");
		buttonChat.setAttribute(
			"style",
			"color:white;background:black;border-radius: 5px;padding:2px ;padding-right: 15px;padding-left: 15px;margin-left:5px"
		);
		buttonChat.setAttribute("id", "replay-button-chat");
		buttonChat.appendChild(document.createTextNode("Chat"));
		buttonChat.style.fontSize = "10px";

		divRepeat = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		divRepeat.setAttributeNS(
			null,
			"style",
			"user-select: none;;background:indianred; border: 1px solid black; border-radius:5px;width: 16px; padding: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;"
		);
		divRepeat.setAttributeNS(null, "version", "1.1");
		divRepeat.setAttributeNS(null, "x", "0px");
		divRepeat.setAttributeNS(null, "y", "0px");
		divRepeat.setAttributeNS(null, "viewBox", "0 0 122.88 118.66");

		divRepeat.innerHTML =
			'<g><path d="M16.68,22.2c-1.78,2.21-3.43,4.55-5.06,7.46C5.63,40.31,3.1,52.39,4.13,64.2c1.01,11.54,5.43,22.83,13.37,32.27 c2.85,3.39,5.91,6.38,9.13,8.97c11.11,8.93,24.28,13.34,37.41,13.22c13.13-0.12,26.21-4.78,37.14-13.98 c3.19-2.68,6.18-5.73,8.91-9.13c6.4-7.96,10.51-17.29,12.07-27.14c1.53-9.67,0.59-19.83-3.07-29.66 c-3.49-9.35-8.82-17.68-15.78-24.21C96.7,8.33,88.59,3.76,79.2,1.48c-2.94-0.71-5.94-1.18-8.99-1.37c-3.06-0.2-6.19-0.13-9.4,0.22 c-2.01,0.22-3.46,2.03-3.24,4.04c0.22,2.01,2.03,3.46,4.04,3.24c2.78-0.31,5.49-0.37,8.14-0.19c2.65,0.17,5.23,0.57,7.73,1.17 c8.11,1.96,15.1,5.91,20.84,11.29c6.14,5.75,10.85,13.12,13.94,21.43c3.21,8.61,4.04,17.51,2.7,25.96 C113.59,75.85,110,84,104.4,90.96c-2.47,3.07-5.12,5.78-7.91,8.13c-9.59,8.07-21.03,12.15-32.5,12.26 c-11.47,0.11-23-3.76-32.76-11.61c-2.9-2.33-5.62-4.98-8.13-7.97c-6.92-8.22-10.77-18.09-11.65-28.2 c-0.91-10.38,1.32-20.99,6.57-30.33c1.59-2.82,3.21-5.07,5.01-7.24l0.53,14.7c0.07,2.02,1.76,3.6,3.78,3.53 c2.02-0.07,3.6-1.76,3.53-3.78l-0.85-23.42c-0.07-2.02-1.76-3.59-3.78-3.52c-0.13,0.01-0.25,0.02-0.37,0.03v0l-22.7,3.19 c-2,0.28-3.4,2.12-3.12,4.13c0.28,2,2.12,3.4,4.13,3.12L16.68,22.2L16.68,22.2L16.68,22.2z M85.78,58.71L53.11,80.65V37.12 L85.78,58.71L85.78,58.71z"/></g>';
		divRepeat.onclick = function () {
			console.log(replayCheck);
			if (replayCheck == true) {
				replayCheckChange(false);
			} else {
				replayCheckChange(true);
			}
			saveReplayLinks();
		};

		div = document.createElement("div");
		div.setAttribute(
			"style",
			"border:1px solid black;padding-left:10px;padding-right:10px ;width:auto;display: inline-flex;align-items:center ;background:#2F2F2F;border-radius: 0px 0px 10px 10px;"
		);
		div.id = "ReplayStrip";

		div.prepend(checkBoxChat);
		div.prepend(buttonChat);
		div.prepend(textStop);
		div.prepend(textStart);
		div.prepend(slider);
		div.prepend(divRepeat);
		div.prepend(buttonMP3);

		frame.parentNode.insertBefore(div, frame.nextSibling);

		if (localStorage.checkBoxChat == "true") {
			checkBoxChat.checked = true;
			onOffLive = false;
		} else {
			checkBoxChat.checked = false;
			onOffLive = true;
		}
		checkBoxChat.onclick = function () {
			if (checkBoxChat.checked) {
				localStorage.checkBoxChat = true;
				onOffLive = false;
			} else {
				localStorage.checkBoxChat = false;
				onOffLive = true;
			}
			console.log(localStorage.checkBoxChat);
		};

		var mouseDown = 0;
		document.body.onmousedown = function () {
			mouseDown = 1;
		};
		document.body.onmouseup = function () {
			mouseDown = 0;
			sliderSelect = 0;
		};
		sliderHidden.onmousemove = function () {
			// var x = e.pageX - this.offsetLeft;

			if (sliderSelect === 1) {
				sliderStop.value = sliderHidden.value;
				sliderStop.focus();
			} else if (sliderSelect === 2) {
				sliderStart.value = sliderHidden.value;
				sliderStart.focus();
			} else if (mouseDown && !sliderSelect) {
				var test2 = Math.abs(sliderHidden.value - sliderStart.value);
				var test1 = Math.abs(sliderHidden.value - sliderStop.value);
				if (test1 / max < 0.04) {
					sliderStop.value = sliderHidden.value;
					sliderStop.focus();
					sliderSelect = 1;
				} else if (test2 / max < 0.04) {
					sliderStart.value = sliderHidden.value;
					sliderStart.focus();
					sliderSelect = 2;
				}
			}
			updateTimeText();
		};

		max = Math.round(yt.getDuration());
		linkTest = yt.getVideoData().video_id;

		// max = duration();
		sliderHidden.max = max;
		sliderStart.max = max;
		sliderStop.max = max;

		sliderStart.value = 0;
		sliderHidden.value = 0;
		sliderStop.value = max - 1;

		updateTimeText();
		textStart.onclick = function () {
			sliderStart.value = yt.getCurrentTime();
			updateTimeText();
		};
		textStop.onclick = function () {
			sliderStop.value = yt.getCurrentTime();
			updateTimeText();
		};
		getReplayStatus(linkTest);

		liveStreamStart();
		clearInterval(init);
		setInterval(loop, 200);
		setInterval(loopSlow, 2000);
	}
}
function getReplayStatus(videoID) {
	if (localStorage.ReplayLastLinks) {
		var arr = JSON.parse(localStorage.ReplayLastLinks);
		console.log("localStorage.ReplayLastLinks");
		console.log(arr);
		console.log(videoID);
		for (let index = 0; index < arr.length; index++) {
			const element = arr[index];
			if (element == videoID || element.id == videoID) {
				if (element.start || element.stop) {
					if (element.start != "0") {
						yt.seekTo(element.start);
					}
					sliderStart.value = element.start;
					sliderStop.value = element.stop;
					console.log(sliderStart);
					console.log("element.start");
					console.log(element.start);
				}
				replayCheckChange(true);
				saveReplayLinks();
				break;
			}
		}
	}
}

function sliderElement() {
	sliderStop = document.createElement("input");
	sliderStop.setAttribute("type", "range");
	sliderStop.setAttribute("class", "slider-front");
	sliderStop.style.position = "absolute";
	sliderStop.style.width = "200px";
	sliderStop.style.borderRadius = "5px";
	sliderStop.style.border = "1px solid black";
	sliderStop.style.margin = "2px";

	sliderStart = document.createElement("input");
	sliderStart.setAttribute("type", "range");
	sliderStart.setAttribute("class", "slider");
	sliderStart.style.position = "absolute";
	sliderStart.style.width = "200px";
	sliderStart.style.borderRadius = "5px";
	sliderStart.style.margin = "3px";

	sliderHidden = document.createElement("input");
	sliderHidden.setAttribute("type", "range");
	sliderHidden.setAttribute("class", "slider");
	sliderHidden.style.position = "absolute";
	sliderHidden.style.width = "200px";
	sliderHidden.style.opacity = "0";
	sliderHidden.style.borderRadius = "5px";
	sliderHidden.style.margin = "3px";

	var divSpacer = document.createElement("div");
	divSpacer.style.width = "200px";
	divSpacer.style.opacity = "0";
	divSpacer.style.position = "relative";

	var sliderContainer = document.createElement("div");

	sliderContainer.style = "display:flex; align-items: center; position: relative;";

	sliderContainer.prepend(divSpacer);
	sliderContainer.prepend(sliderHidden);
	sliderContainer.prepend(sliderStart);
	sliderContainer.prepend(sliderStop);
	return sliderContainer;
}

function loopSlow() {
	if (replayCheck === true) {
		saveReplayLinks();
	}
}

function loop() {
	yt = document.getElementById("movie_player");

	var maxTmp = max;
	max = Math.round(yt.getDuration());

	if (!max) {
		max = maxTmp;
	}

	if (linkTest !== yt.getVideoData().video_id) {
		sliderHidden.max = max;
		sliderStart.max = max;
		sliderStop.max = max;

		sliderStart.value = 0;
		sliderStop.value = max - 1;
		console.log(sliderStop.value);
		console.log(sliderStop.max);
		console.log(yt.getDuration());

		buttonMP3.style.color = "white";
		buttonMP3.disabled = false;
		linkTest = yt.getVideoData().video_id;
		updateTimeText();
		if (!window.location.href.includes("&list=")) {
			replayCheckChange(false);
		}
		getReplayStatus(linkTest);

		liveStreamReset();
	}

	if (replayCheck === true) {
		if (
			parseInt(sliderStart.value) >= parseInt(sliderStop.value) ||
			sliderStop.value === 0 ||
			maxTmp != max
		) {
			sliderStart.value = 0;
			sliderStop.value = max - 1;
		}

		var tmp = valueStop;
		if (sliderStop.value == sliderStop.max) {
			tmp = yt.getDuration();
		}

		if (tmp <= yt.getCurrentTime()) {
			yt.seekTo(valueStart);
		}
		updateTimeText();
	}
}

function replayCheckChange(value) {
	if (value) {
		divRepeat.setAttributeNS(
			null,
			"style",
			"user-select: none;;background:springgreen; border: 1px solid black; border-radius:5px;width: 16px; padding: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;"
		);
	} else {
		divRepeat.setAttributeNS(
			null,
			"style",
			"user-select: none;;background:indianred; border: 1px solid black; border-radius:5px;width: 16px; padding: 2px;margin-left: 3px;margin-top: 1px;margin-bottom: 1px;"
		);
	}

	replayCheck = value;
	console.log("replayCheckChange");
	console.log(value);
}
function saveReplayLinks() {
	var arr = [];
	if (localStorage.ReplayLastLinks) {
		arr = JSON.parse(localStorage.ReplayLastLinks);
	}
	var index = -1;
	for (let i = 0; i < arr.length; i++) {
		const element = arr[i];
		if (element == linkTest || element.id == linkTest) {
			index = i;
			break;
		}
	}
	// console.log(index);
	if (!replayCheck) {
		if (index > -1) {
			arr.splice(index, 1);
		}
	} else {
		if (yt.getCurrentTime() < valueStart) {
			yt.seekTo(valueStart);
		}

		if (index > -1) {
			arr.splice(index, 1);
		}

		var object = {};
		object.id = linkTest;
		object.start = sliderStart.value;
		object.stop = sliderStop.value;
		console.log(object);
		arr.push(object);

		while (arr.length > 25) {
			arr.shift();
		}
	}
	// console.log(arr);
	localStorage.ReplayLastLinks = JSON.stringify(arr);
}

function updateTimeText() {
	if (sliderStart.value + "" != valueStart || sliderStop.value + "" != valueStop) {
		valueStart = sliderStart.value + "";
		valueStop = sliderStop.value + "";
		var ex = "";
		if (parseInt(parseInt(valueStop) % 60) < 10) {
			ex = "0";
		}
		textStop.value = parseInt(parseInt(valueStop) / 60) + ":" + ex + parseInt(parseInt(valueStop) % 60);
		ex = "";
		if (parseInt(parseInt(valueStart) % 60) < 10) {
			ex = "0";
		}
		textStart.value = parseInt(parseInt(valueStart) / 60) + ":" + ex + parseInt(parseInt(valueStart) % 60);

		var precStart = parseInt((sliderStart.value / sliderStart.max) * 100);
		var precStop = parseInt((sliderStop.value / sliderStop.max) * 100);
		sliderStop.style.background = `
	linear-gradient(90deg,
		rgba(234,234,234,1) ${precStart}%,
		rgba(115,115,255,1) ${precStart}%,
		rgba(115,115,255,1) ${precStop + 1}%,
		rgba(234,234,234,1) ${precStop + 1}%)`;
	}
}

function liveStreamStart() {
	liveStreamReset();
	setInterval(liveStreamLoop, 500);
	buttonChat.onclick = function f() {
		if (!onOffLive) {
			onOffLive = true;
		} else {
			onOffLive = false;
		}
	};
}
function liveStreamReset() {
	fullscreenLive = false;
	isLiveStream = false;
	chatNode = document.body.querySelector("#chat");
	checkTheaterMode = document.body.querySelector("#player-theater-container");

	if (styleLive) {
		styleLive.remove();
		styleLive = null;
	}

	var bFullscreen = document.body.querySelector(".ytp-fullscreen-button");
	if (bFullscreen) {
		bFullscreen.onclick = function f() {
			if (fullscreenLive == false) {
				fullscreenLive = true;
			} else {
				fullscreenLive = false;
			}
		};
	}
}

function liveStreamLoop() {
	// console.log("jjjjee");
	if (fullscreenLive) {
		return;
	}
	if (onOffLive) {
		if (styleLive) {
			styleLive.remove();
			styleLive = null;

			enableTheaterMode(true);
		}
		return;
	}
	chatNode = document.body.querySelector("#chat");

	if (chatNode && !styleLive) {
		isLiveStream = true;

		enableTheaterMode(false);

		cssLiveStream();
		//clearInterval(loop);
	} else if (styleLive && !chatNode) {
		enableTheaterMode(true);

		if (styleLive) {
			styleLive.remove();
			styleLive = null;
		}
	} else if (!chatNode) {
		enableTheaterMode(true);
	} else if (chatNode && isLiveStream) {
		var showChat = document.body.querySelector("#show-hide-button #button");
		if (showChat) {
			var check = chatNode.getAttribute("collapsed");
			if (check != null) {
				showChat.click();
			}
		}

		enableTheaterMode(false);
	}
}

function enableTheaterMode(enable) {
	checkTheaterMode = document.body.querySelector("#player-theater-container");

	if (
		(!enable && checkTheaterMode.childNodes.length > 0) ||
		(enable && checkTheaterMode.childNodes.length == 0)
	) {
		var btn = document.querySelector(".ytp-size-button");
		btn.click();
	}
}

function cssLiveStream() {
	var css = `
		#primary,#player{
			padding:0px!important;
			margin:0px!important;
			max-width:10000px!important;
			width:100%!important;
			max-height:10000px!important;
		}
		.html5-video-container,.html5-video-container *{
			width:100%!important;
			height:100%!important;
		}
		#player-container-outer{
			max-width:10000px!important;
		}
		#secondary{
			padding:0!important;
			max-height:10000px!important;
			height:auto!important;
		}
		#chat{
			max-height:10000px!important;
			height:100vh!important;
		}
		#masthead-container{
			opacity:0;
		}
		#masthead-container:hover{
			opacity:1;
		}
		#page-manager{
			margin: 0!important;
		}
`;

	var head = document.head || document.getElementsByTagName("head")[0];

	styleLive = document.createElement("style");
	head.appendChild(styleLive);

	styleLive.type = "text/css";
	styleLive.name = "test";
	styleLive.appendChild(document.createTextNode(css));
}
