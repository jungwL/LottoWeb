document.addEventListener('DOMContentLoaded', () => {
  const resultBallsContainer = document.getElementById('result-balls');
  const lottoMachine = document.getElementById('lotto-machine');
  const startButton = document.getElementById('start-button');

  let isDrawing = false;
  let shuffleTimer;
  let selectedBalls = [];

  // 공의 색상을 결정하는 함수 (CSS 클래스 이름 반환)
  const getBallColorClass = (number) => {
    if (number <= 10) return 'color-yellow';
    if (number <= 20) return 'color-blue';
    if (number <= 30) return 'color-red';
    if (number <= 40) return 'color-grey';
    return 'color-green';
  };

  // 지연 함수
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // 초기 상태 설정
  const initialize = () => {
    resultBallsContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      if (i === 6) {
        const plus = document.createElement('div');
        plus.className = 'bonus-separator';
        plus.textContent = '+';
        resultBallsContainer.appendChild(plus);
      }
      const ball = document.createElement('div');
      ball.className = 'ball placeholder';
      resultBallsContainer.appendChild(ball);
    }
  };

  const reset = () => {
    isDrawing = false;
    selectedBalls = [];
    lottoMachine.innerHTML = '';
    initialize();
    startButton.disabled = false;
    startButton.innerHTML = '<span class="icon">🎰</span> 추첨 시작!';
  };

  // 추첨 시작 함수
  const startDrawing = async () => {
    if (isDrawing) return;
    isDrawing = true;

    reset();

    startButton.disabled = true;
    startButton.textContent = '섞는 중...';

    // 1. 45개 공 생성 및 머신에 추가
    const allBalls = [];
    for (let i = 1; i <= 45; i++) {
      const ballData = { number: i, colorClass: getBallColorClass(i) };
      allBalls.push(ballData);

      const ballElement = document.createElement('div');
      ballElement.className = `ball ball-small ${ballData.colorClass}`;
      ballElement.textContent = i;
      ballElement.style.left = `${Math.random() * 265}px`; // 300 - 35
      ballElement.style.top = `${Math.random() * 265}px`;
      lottoMachine.appendChild(ballElement);
    }

    // 2. 공 섞기 애니메이션
    const machineBalls = lottoMachine.children;
    shuffleTimer = setInterval(() => {
      for (const ball of machineBalls) {
        ball.style.left = `${Math.random() * 265}px`;
        ball.style.top = `${Math.random() * 265}px`;
      }
    }, 500);

    await sleep(3000); // 3초간 섞기
    clearInterval(shuffleTimer);
    startButton.textContent = '추첨 중...';

    // 3. 공 뽑기
    const availableBalls = [...allBalls];
    const resultBallElements = document.querySelectorAll('.result-panel .ball');

    for (let i = 0; i < 7; i++) {
      await sleep(1200); // 1.2초 간격

      const pickedIndex = Math.floor(Math.random() * availableBalls.length);
      const pickedBallData = availableBalls.splice(pickedIndex, 1)[0];
      selectedBalls.push(pickedBallData);

      // 머신에서 해당 공 숨기기
      for (const ball of machineBalls) {
        if (parseInt(ball.textContent) === pickedBallData.number) {
          ball.style.display = 'none';
          break;
        }
      }

      // 결과 패널에 공 표시
      const targetBall = resultBallElements[i];
      targetBall.className = `ball ${pickedBallData.colorClass}`;
      targetBall.textContent = pickedBallData.number;
    }

    // 4. 추첨 완료
    isDrawing = false;
    startButton.disabled = false;
    startButton.innerHTML = '<span class="icon">🎰</span> 다시 추첨!';
  };

  startButton.addEventListener('click', startDrawing);
  initialize(); // 페이지 로드 시 초기화
});
