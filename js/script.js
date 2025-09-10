document.addEventListener('DOMContentLoaded', () => {

  // ===============================================
  // 1. 탭 전환 로직 (Tab Switching Logic)
  // ===============================================
  const tabButtons = document.querySelectorAll('.tab-button');
  const contentPanels = document.querySelectorAll('.content-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      contentPanels.forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');
      const targetPanel = document.getElementById(button.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });


  // ===============================================
  // 2. 로또 6/45 로직 (Lotto 6/45 Logic)
  // ===============================================
  const lottoResultContainer = document.getElementById('result-balls');
  const lottoMachine = document.getElementById('lotto-machine');
  const lottoStartButton = document.getElementById('start-button');

  let isLottoDrawing = false;
  let shuffleTimer;

  const getBallColorClass = (number) => {
    if (number <= 10) return 'color-yellow';
    if (number <= 20) return 'color-blue';
    if (number <= 30) return 'color-red';
    if (number <= 40) return 'color-grey';
    return 'color-green';
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const initializeLottoPanel = () => {
    lottoResultContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'ball';
      placeholder.style.backgroundColor = '#e9ecef';
      lottoResultContainer.appendChild(placeholder);
    }
  };

  const startLottoDrawing = async () => {
    if (isLottoDrawing) return;
    isLottoDrawing = true;

    lottoStartButton.disabled = true;
    lottoStartButton.innerHTML = '<span>🔄</span> 섞는 중...';
    initializeLottoPanel();
    lottoMachine.innerHTML = '';

    const allBalls = Array.from({ length: 45 }, (_, i) => i + 1);

    const machineBallElements = allBalls.map(num => {
      const ballElement = document.createElement('div');
      ballElement.className = `ball machine-ball ${getBallColorClass(num)}`;
      ballElement.textContent = num;
      ballElement.style.left = `${Math.random() * (300 - 35)}px`;
      ballElement.style.top = `${Math.random() * (300 - 35)}px`;
      lottoMachine.appendChild(ballElement);
      return ballElement;
    });

    shuffleTimer = setInterval(() => {
      machineBallElements.forEach(ball => {
        ball.style.left = `${Math.random() * (300 - 35)}px`;
        ball.style.top = `${Math.random() * (300 - 35)}px`;
      });
    }, 500);

    await sleep(3000);
    clearInterval(shuffleTimer);
    lottoStartButton.innerHTML = '<span>👀</span> 추첨 중...';

    allBalls.sort(() => Math.random() - 0.5);
    const pickedNumbers = allBalls.slice(0, 6);
    pickedNumbers.sort((a, b) => a - b);

    const resultBallElements = lottoResultContainer.querySelectorAll('.ball');

    for (let i = 0; i < 6; i++) {
      await sleep(1000);
      const pickedNumber = pickedNumbers[i];
      const targetBall = resultBallElements[i];

      targetBall.style.backgroundColor = '';
      targetBall.className = `ball ${getBallColorClass(pickedNumber)}`;
      targetBall.textContent = pickedNumber;
    }

    isLottoDrawing = false;
    lottoStartButton.disabled = false;
    lottoStartButton.innerHTML = '<span>🎰</span> 다시 추첨!';
  };

  lottoStartButton.addEventListener('click', startLottoDrawing);


  // ===================================================
  // 3. 연금복권 720+ 로직 (Pension Lottery 720+ Logic)
  // ===================================================
  const pensionDisplayContainer = document.getElementById('pension-number-display');
  const pensionGenerateBtn = document.getElementById('pension-generate-btn');

  const pensionDigitColors = [
    'pension-color-1', 'pension-color-2', 'pension-color-3',
    'pension-color-4', 'pension-color-5', 'pension-color-6'
  ];

  // ✅ [수정됨] 연금복권 패널을 초기화하는 함수
  function initializePensionPanel() {
    pensionDisplayContainer.innerHTML = ''; // Clear previous state

    // '조' 번호 placeholder
    const groupBall = document.createElement('div');
    groupBall.className = 'ball';
    groupBall.style.backgroundColor = '#e9ecef';
    pensionDisplayContainer.appendChild(groupBall);

    // '조' 텍스트
    const groupText = document.createElement('span');
    groupText.className = 'pension-text';
    groupText.textContent = '조';
    pensionDisplayContainer.appendChild(groupText);

    // 6자리 번호 placeholders
    for (let i = 0; i < 6; i++) {
      const digitBall = document.createElement('div');
      digitBall.className = 'ball';
      digitBall.style.backgroundColor = '#e9ecef';
      pensionDisplayContainer.appendChild(digitBall);
    }
  }

  function generatePensionNumber() {
    pensionDisplayContainer.innerHTML = ''; // 이전 번호 지우기

    const group = Math.floor(Math.random() * 5) + 1;
    const digits = Math.floor(Math.random() * 1000000);
    const formattedDigits = digits.toString().padStart(6, '0');

    const groupBall = document.createElement('div');
    groupBall.className = 'ball';
    groupBall.textContent = group;
    pensionDisplayContainer.appendChild(groupBall);

    const groupText = document.createElement('span');
    groupText.className = 'pension-text';
    groupText.textContent = '조';
    pensionDisplayContainer.appendChild(groupText);

    for (let i = 0; i < formattedDigits.length; i++) {
      const digitBall = document.createElement('div');
      digitBall.className = `ball ${pensionDigitColors[i]}`;
      digitBall.textContent = formattedDigits[i];
      pensionDisplayContainer.appendChild(digitBall);
    }
  }

  pensionGenerateBtn.addEventListener('click', generatePensionNumber);


  // ===============================================
  // 4. 페이지 초기화 (Page Initialization)
  // ===============================================
  initializeLottoPanel();
  initializePensionPanel(); // ✅ [수정됨] 페이지 로드 시 연금복권 패널 초기화
});

