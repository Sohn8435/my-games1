document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 가져오기 ---
    const drawButton = document.getElementById('draw-button');
    const gumballMachine = document.getElementById('gumball-machine');
    const maxNumberInput = document.getElementById('max-number');
    const drawCountInput = document.getElementById('draw-count');
    const resultArea = document.getElementById('result-area');
    const resultNumbersContainer = document.getElementById('result-numbers');

    let isDrawing = false;

    // ✅ MODIFIED: 함수 이름을 getGumballs로 변경
    function getGumballs() {
        if (isDrawing) return;

        const maxNumber = parseInt(maxNumberInput.value);
        const drawCount = parseInt(drawCountInput.value);

        if (maxNumber < drawCount) {
            alert(`최대 숫자는 뽑을 개수(${drawCount}개)보다 크거나 같아야 합니다.`);
            return;
        }
        if (isNaN(maxNumber) || isNaN(drawCount) || maxNumber <= 0 || drawCount <= 0) {
            alert("유효한 숫자를 입력해주세요.");
            return;
        }

        isDrawing = true;
        resultArea.classList.add('hidden');
        
        // 기계 흔들기 애니메이션 시작
        gumballMachine.classList.add('shake');

        // 애니메이션 시간(800ms) 후 결과 표시
        setTimeout(() => {
            // 애니메이션 클래스 제거
            gumballMachine.classList.remove('shake');
            
            const results = new Set();
            while (results.size < drawCount) {
                const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
                results.add(randomNumber);
            }

            const sortedResults = Array.from(results).sort((a, b) => a - b);
            displayResults(sortedResults);
            
            isDrawing = false;
        }, 800);
    }

    function displayResults(numbers) {
        resultNumbersContainer.innerHTML = '';
        const colors = ["#ff6b6b", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#f8961e", "#277da1", "#f94144"];

        numbers.forEach((num, index) => {
            const numberBox = document.createElement('div');
            numberBox.className = 'result-number-box';
            numberBox.textContent = num;
            // 각 풍선껌에 다른 색상 적용
            numberBox.style.backgroundColor = colors[index % colors.length];
            resultNumbersContainer.appendChild(numberBox);
        });
        resultArea.classList.remove('hidden');
    }

    // --- 이벤트 리스너 설정 ---
    drawButton.addEventListener('click', getGumballs);
});
