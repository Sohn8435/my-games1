document.addEventListener('DOMContentLoaded', () => {
    const canvasSize = Math.min(window.innerWidth * 0.9, 300);  // 최대 300px까지
          canvas.width = canvasSize;
          canvas.height = canvasSize;
    const spinButton = document.getElementById('spin-button');
    const maxNumberInput = document.getElementById('max-number');
    const drawCountInput = document.getElementById('draw-count'); // 뽑을 개수 입력창
    const resultArea = document.getElementById('result-area');
    const resultNumbersContainer = document.getElementById('result-numbers');

    const colors = ["#ff6b6b", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#f8961e", "#277da1", "#f94144"];
    let currentRotation = 0;
    let isSpinning = false;

    function drawWheel(maxNumber) {
        ctx.clearRect(0, 0, 300, 300);
        if (maxNumber <= 0) return;
        const arcSize = 2 * Math.PI / maxNumber;
        
        for (let i = 0; i < maxNumber; i++) {
            const angle = i * arcSize;
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 150, angle, angle + arcSize);
            ctx.lineTo(150, 150);
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "bold 16px Jua";
            ctx.translate(150 + 110 * Math.cos(angle + arcSize / 2), 150 + 110 * Math.sin(angle + arcSize / 2));
            ctx.rotate(angle + arcSize / 2 + Math.PI / 2);
            ctx.fillText(i + 1, -ctx.measureText(i + 1).width / 2, 0);
            ctx.restore();
        }
    }

    function spinWheel() {
        if (isSpinning) return;
        
        const maxNumber = parseInt(maxNumberInput.value);
        const drawCount = parseInt(drawCountInput.value); // 입력창에서 뽑을 개수 가져오기
        
        if (maxNumber < drawCount) {
            alert(`최대 숫자는 뽑을 개수(${drawCount}개)보다 크거나 같아야 합니다.`);
            return;
        }
        if (isNaN(maxNumber) || isNaN(drawCount) || maxNumber <= 0 || drawCount <= 0) {
            alert("유효한 숫자를 입력해주세요.");
            return;
        }

        isSpinning = true;
        resultArea.classList.add('hidden');
        drawWheel(maxNumber);

        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const finalRotation = 360 * randomSpins + Math.random() * 360;
        currentRotation += finalRotation;
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            isSpinning = false;
            
            const results = new Set();
            while(results.size < drawCount) {
                const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
                results.add(randomNumber);
            }
            
            displayResults(Array.from(results));
        }, 5000);
    }

    function displayResults(numbers) {
        resultNumbersContainer.innerHTML = '';
        numbers.forEach(num => {
            const numberBox = document.createElement('div');
            numberBox.className = 'result-number-box';
            numberBox.textContent = num;
            resultNumbersContainer.appendChild(numberBox);
        });
        resultArea.classList.remove('hidden');
    }
    
    spinButton.addEventListener('click', spinWheel);
    maxNumberInput.addEventListener('input', () => drawWheel(parseInt(maxNumberInput.value)));

    drawWheel(parseInt(maxNumberInput.value));
});
