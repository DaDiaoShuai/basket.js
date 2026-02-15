const state = {
  isRunning: false,
  mode: 'work',
  remainingSeconds: 25 * 60,
  workMinutes: 25,
  breakMinutes: 5,
  pomodoroCount: 0,
  totalSecondsInMode: 25 * 60,
  timerId: null
};

const elements = {
  modeLabel: document.getElementById('modeLabel'),
  timeDisplay: document.getElementById('timeDisplay'),
  statusText: document.getElementById('statusText'),
  progressBar: document.getElementById('progressBar'),
  startPauseBtn: document.getElementById('startPauseBtn'),
  resetBtn: document.getElementById('resetBtn'),
  skipBtn: document.getElementById('skipBtn'),
  workInput: document.getElementById('workInput'),
  breakInput: document.getElementById('breakInput'),
  pomodoroCount: document.getElementById('pomodoroCount')
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function render() {
  elements.modeLabel.textContent = state.mode === 'work' ? '专注时间' : '休息时间';
  elements.timeDisplay.textContent = formatTime(state.remainingSeconds);
  elements.startPauseBtn.textContent = state.isRunning ? '暂停' : '开始';
  elements.statusText.textContent = state.isRunning
    ? '计时中...'
    : (state.remainingSeconds === state.totalSecondsInMode ? '准备开始' : '已暂停');

  const elapsed = state.totalSecondsInMode - state.remainingSeconds;
  const progress = (elapsed / state.totalSecondsInMode) * 100;
  elements.progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
  elements.pomodoroCount.textContent = String(state.pomodoroCount);
  document.title = `${elements.timeDisplay.textContent} - ${elements.modeLabel.textContent}`;
}

function switchMode(nextMode) {
  state.mode = nextMode;
  state.totalSecondsInMode = (nextMode === 'work' ? state.workMinutes : state.breakMinutes) * 60;
  state.remainingSeconds = state.totalSecondsInMode;
  render();
}

function tick() {
  if (!state.isRunning) {
    return;
  }

  if (state.remainingSeconds > 0) {
    state.remainingSeconds -= 1;
    render();
    return;
  }

  if (state.mode === 'work') {
    state.pomodoroCount += 1;
    switchMode('break');
  } else {
    switchMode('work');
  }
}

function start() {
  if (state.isRunning) {
    return;
  }
  state.isRunning = true;
  state.timerId = window.setInterval(tick, 1000);
  render();
}

function pause() {
  state.isRunning = false;
  window.clearInterval(state.timerId);
  state.timerId = null;
  render();
}

function reset() {
  pause();
  state.mode = 'work';
  state.totalSecondsInMode = state.workMinutes * 60;
  state.remainingSeconds = state.totalSecondsInMode;
  render();
}

function updateSettings() {
  const work = Number.parseInt(elements.workInput.value, 10);
  const rest = Number.parseInt(elements.breakInput.value, 10);

  if (Number.isInteger(work) && work > 0) {
    state.workMinutes = work;
  }

  if (Number.isInteger(rest) && rest > 0) {
    state.breakMinutes = rest;
  }

  reset();
}

function skipCurrentMode() {
  const nextMode = state.mode === 'work' ? 'break' : 'work';
  switchMode(nextMode);
}

elements.startPauseBtn.addEventListener('click', () => {
  if (state.isRunning) {
    pause();
  } else {
    start();
  }
});

elements.resetBtn.addEventListener('click', reset);
elements.skipBtn.addEventListener('click', skipCurrentMode);
elements.workInput.addEventListener('change', updateSettings);
elements.breakInput.addEventListener('change', updateSettings);

render();
