// Cria o objeto Timer
class Timer {

    // Atribui o valor inserido através da interface
    setTime(_time) {
        this.time = _time;
        this.currentTime = _time
    }

    // Atribui o valor de intervalo de tempo --> padrão: 100ms
    setTimeInterval(_timeInterval) {
        this.timeInterval = _timeInterval;
    }

    // Atribui a função de callback de timeout
    setCallbackTimeout(_callbackTimeout) {
        this.callbackTimeout = _callbackTimeout;
    }

    // Atribui a função de callback de interval
    setCallbackTimeInterval(_callbackTimeInterval) {
        this.callbackTimeInterval = _callbackTimeInterval;
    }

    setAudio(_audio) {
        this.audio = _audio;
    }

    // Gera o valor do tempo corrente
    getCurrentTime() {
        this.currentTime -= this.timeInterval;
        return this.currentTime;
    }

    // Inicia o temporizador
    startTimer() {
        this.internalTimeInterval = setInterval(this.callbackTimeInterval, this.timeInterval);
        this.internalTimeout = setTimeout(this.callbackTimeout, (this.time + this.timeInterval));
    }

    // Para o temporizador sem apagar as variáveis 
    stopTimer() {
        clearInterval(this.internalTimeInterval);
        clearTimeout(this.internalTimeout);
    }

    // Apaga completamente o temporizador
    resetTimer() {
        clearInterval(this.internalTimeInterval);
        clearTimeout(this.internalTimeout);
        this.time = 0;
        this.currentTime = 0;
    }

    getCurrentTimeString() {

        let hours;
        if (this.currentTime < 36000000 && this.currentTime >= 3600000) {
            hours = `0${parseInt(this.currentTime/3600000)}`;
        } else if (this.currentTime >= 36000000) {
            hours = `${parseInt(this.currentTime/3600000)}`;
        } else {
            hours = "00";
        }

        let minutes;
        if (parseInt((this.currentTime - hours * 3600000) / 60000) < 10) {
            minutes = `0${parseInt((this.currentTime - hours * 3600000) / 60000)}`;
        } else if (parseInt((this.currentTime - hours * 3600000) / 60000) >= 10) {
            minutes = `${parseInt((this.currentTime - hours * 3600000) / 60000)}`;
        } else {
            minutes = "00";
        }

        let seconds;
        if (parseInt((this.currentTime - (hours * 3600000 + 60000 * minutes)) / 1000) < 10) {
            seconds = `0${parseInt((this.currentTime - (hours * 3600000 + 60000 * minutes)) / 1000)}`;
        } else if (parseInt((this.currentTime - (hours * 3600000 + 60000 * minutes)) / 1000) >= 10) {
            seconds = `${parseInt((this.currentTime - (hours * 3600000 + 60000 * minutes)) / 1000)}`;
        } else {
            seconds = "00";
        }

        let milisseconds = `${parseInt((this.currentTime - (hours * 3600000 + 60000 * minutes + seconds * 1000)) / 100)}`;
        return hours + ":" + minutes + ":" + seconds + "." + milisseconds;
    }
}
// Variáveis Comuns
let timers = [];
let timerIndex = 0;

function addTimerButtonAction() {
    if (timerIndex < 4) {
        timers.push(new Timer());

        document.getElementById("all-timers").innerHTML += `
            <div class="timer">
                <div class="timer-control">
                    <input type="number" value="0" class="input" id="hours-input${timerIndex}" min="0"> :
                    <input type="number" value="0" class="input" id="minutes-input${timerIndex}" min="0" max="59"> :
                    <input type="number" value="0" class="input" id="seconds-input${timerIndex}" min="0" max="59"> .
                    <input type="number" value="0" class="input" id="milisseconds-input${timerIndex}" min="0" max="9">

                    <button id="start-button${timerIndex}" onclick="startButtonAction(${timerIndex})">Start</button >
                    <button onclick="pauseButtonAction(${timerIndex})">Pause</button>
                    <button onclick="resetButtonAction(${timerIndex})">Reset</button>
                </div>

                <h2 class="timer-display" id="display${timerIndex}">00:00:00.0</h2>
            </div>`;
        
            document.getElementById("audio").innerHTML += `
                <audio id="alarm${timerIndex}" src="/assets/audios/classic-alarm.wav" loop></audio>`;

        timerIndex++;
    }
}

function startButtonAction(_timerIndex) {
    timers[_timerIndex].setTimeInterval(100);

    timers[_timerIndex].setCallbackTimeout(() => {
        timers[_timerIndex].setAudio(document.getElementById(`alarm${_timerIndex}`))
        timers[_timerIndex].time = timers[_timerIndex].currentTime = 0;
        clearInterval(timers[_timerIndex].internalTimeInterval);
        document.getElementById(`display${_timerIndex}`).style.color = "rgb(255, 0, 0)"
        document.getElementById(`display${_timerIndex}`).innerHTML = "00:00:00.0";
        timers[_timerIndex].audio.play();
        document.getElementById(`start-button${_timerIndex}`).disabled = false;
    }); 

    timers[_timerIndex].setCallbackTimeInterval(() => {
        timers[_timerIndex].getCurrentTime();
        document.getElementById(`display${_timerIndex}`).innerHTML = timers[_timerIndex].getCurrentTimeString();
    });

    if (timers[_timerIndex].time == 0 || timers[_timerIndex].time == undefined) {
        timers[_timerIndex].setTime(sumTime(_timerIndex));
    }
    
    document.getElementById(`start-button${_timerIndex}`).disabled = true;
    timers[_timerIndex].startTimer();
}


function pauseButtonAction(_timerIndex) {
    timers[_timerIndex].stopTimer();
    document.getElementById(`start-button${_timerIndex}`).disabled = false;
    timers[_timerIndex].time = timers[_timerIndex].currentTime;
}

function resetButtonAction(_timerIndex) {
    timers[_timerIndex].resetTimer();
    document.getElementById(`display${_timerIndex}`).innerHTML = "00:00:00.0";
    timers[_timerIndex].audio.pause();
    timers[_timerIndex].audio.currentTime = 0;
    document.getElementById(`display${_timerIndex}`).style.color = "rgb(255, 255, 255)"
    document.getElementById(`start-button${_timerIndex}`).disabled = false;
}

function sumTime(_timerIndex) {
    let milisseconds = parseInt(document.getElementById(`milisseconds-input${_timerIndex}`).value) * 100;
    let seconds = parseInt(document.getElementById(`seconds-input${_timerIndex}`).value) * 1000;
    let minutes = parseInt(document.getElementById(`minutes-input${_timerIndex}`).value) * 60000;
    let hours = parseInt(document.getElementById(`hours-input${_timerIndex}`).value) * 3600000;
    let timeInMilisseconds = milisseconds + seconds + minutes + hours;
    return timeInMilisseconds;
}