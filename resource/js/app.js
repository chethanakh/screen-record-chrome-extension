// let stream = null,
// 	audio = null,
// 	mixedStream = null,
// 	chunks = [], 
// 	recorder = null
// 	startButton = null,
// 	stopButton = null,
// 	downloadButton = null,
// 	recordedVideo = null;

// async function setupStream () {
// 	try {
// 		stream = await navigator.mediaDevices.getDisplayMedia({
// 			video: true,
//             audio: true
// 		});

// 		audio = await navigator.mediaDevices.getUserMedia({
// 			audio: {
// 				echoCancellation: true,
// 				noiseSuppression: true,
// 				sampleRate: 44100,
// 			},
// 		});

// 		setupVideoFeedback();
// 	} catch (err) {
// 		console.error(err)
// 	}
// }

// function setupVideoFeedback() {
// 	if (stream) {
// 		const video = document.querySelector('.video-feedback');
// 		video.srcObject = stream;
// 		video.play();
// 	} else {
// 		console.warn('No stream available');
// 	}
// }

// const mergeAudioStreams = (display, voiceStream) => {
//     const context = new AudioContext();

//     // Create a couple of sources
//     const source1 = context.createMediaStreamSource(display);
//     const source2 = context.createMediaStreamSource(voiceStream);
//     const destination = context.createMediaStreamDestination();

//     const desktopGain = context.createGain();
//     const voiceGain = context.createGain();

//     desktopGain.gain.value = 0.7;
//     voiceGain.gain.value = 0.7;

//     source1.connect(desktopGain).connect(destination);
//     source2.connect(voiceGain).connect(destination);

//     return destination.stream;
// }; 

// async function startRecording () {
// 	await setupStream();
//     console.log(stream);

// 	if (stream && audio) {
// 		mixedStream = new MediaStream([...stream.getTracks(), mergeAudioStreams(stream,audio).getAudioTracks()[0]]);
// 		recorder = new MediaRecorder(mixedStream);
// 		recorder.ondataavailable = handleDataAvailable;
// 		recorder.onstop = handleStop;
// 		recorder.start(1000);

// 		startButton.disabled = true;
// 		stopButton.disabled = false;

// 		console.log('Recording started');
// 	} else {
// 		console.warn('No stream available.');
// 	}
// }

// function stopRecording () {
// 	recorder.stop();

// 	startButton.disabled = false;
// 	stopButton.disabled = true;
// }

// function handleDataAvailable (e) {
// 	chunks.push(e.data);
// }

// function handleStop (e) {
// 	const blob = new Blob(chunks, { 'type' : 'video/mp4' });
// 	chunks = [];

// 	downloadButton.href = URL.createObjectURL(blob);
// 	downloadButton.download = 'video.mp4';
// 	downloadButton.disabled = false;

// 	recordedVideo.src = URL.createObjectURL(blob);
// 	recordedVideo.load();
// 	recordedVideo.onloadeddata = function() {
// 		const rc = document.querySelector(".recorded-video-wrap");
// 		rc.classList.remove("hidden");
// 		rc.scrollIntoView({ behavior: "smooth", block: "start" });

// 		recordedVideo.play();
// 	}

// 	stream.getTracks().forEach((track) => track.stop());
// 	audio.getTracks().forEach((track) => track.stop());

// 	console.log('Recording stopped');
// }

// window.addEventListener('load', () => {
// 	startButton = document.querySelector('.start-recording');
// 	stopButton = document.querySelector('.stop-recording');
// 	downloadButton = document.querySelector('.download-video');
// 	recordedVideo = document.querySelector('.recorded-video');

// 	startButton.addEventListener('click', startRecording);
// 	stopButton.addEventListener('click', stopRecording);
// })

const StartRecordBtn = document.getElementById("start-recording-btn");
const RecordInprogressBtn = document.getElementById("recording-in-progress-btn");
const StopRecordBtn = document.getElementById("stop-recording-btn");
const OngoingTimerLabel = document.getElementById("ongoin-timer-label");

const TimerLabel = document.getElementById("timer-label");
const FileSize = document.getElementById("size-label");
const DownloadBtn = document.getElementById("download-btn");

let recordTimer = 0;
let recordTimerInterval;



StartRecordBtn.addEventListener('click', startRecording)
StopRecordBtn.addEventListener('click', stopRecording)
DownloadBtn.addEventListener('click', downloadRecord)

window.addEventListener('load', () => {
    show(StartRecordBtn)
    hide(RecordInprogressBtn)
    hide(StopRecordBtn)

    hide(TimerLabel)
    hide(FileSize)
    hide(DownloadBtn)
})

function stopRecording() {
    show(StartRecordBtn)
    hide(RecordInprogressBtn)
    hide(StopRecordBtn)

    stopTimer();

    TimerLabel.innerHTML = secondsToTimer(recordTimer);
    //may need move
    show(TimerLabel)
    show(FileSize)
    show(DownloadBtn)

    chrome.runtime.sendMessage({
        action: 'stopRecording'
    });
}

function startRecording() {
    hide(StartRecordBtn)
    show(RecordInprogressBtn)
    show(StopRecordBtn)

    startTimer()

    FileSize.innerHTML = "0 bytes"

    hide(TimerLabel)
    hide(FileSize)
    hide(DownloadBtn)

    chrome.runtime.sendMessage({
        action: 'startRecording'
    });
}

function downloadRecord() {
    alert('downloding')
}

function hide(element) {
    element.classList.add('hidden');
}

function show(element) {
    element.classList.remove('hidden');
}

function secondsToTimer(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours}:${minutes}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    recordTimer = 0;
    OngoingTimerLabel.innerHTML = secondsToTimer(recordTimer);
    recordTimerInterval = setInterval(() => {
        recordTimer = recordTimer + 1;
        OngoingTimerLabel.innerHTML = secondsToTimer(recordTimer);
    }, 1000)
}

function stopTimer() {
    clearInterval(recordTimerInterval)
}