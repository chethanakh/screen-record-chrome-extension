chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    switch (msg.action) {
        case "startRecording":
            startRecordingAction();
            break;
        case "stopRecording":
            stopRecordingAction();
            break;

        default:
            break;
    }
});


function startRecordingAction() {
    chrome.action.setIcon({ path: "../img/extension_icon_recording.png" })
}

function stopRecordingAction() {
    chrome.action.setIcon({ path: "../img/extension_icon-128px.png" })
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