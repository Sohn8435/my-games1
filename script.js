document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const wheelContainer = document.querySelector('.wheel-container');
    const spinButton = document.getElementById('spin-button');
    const maxNumberInput = document.getElementById('max-number');
    const drawCountInput = document.getElementById('draw-count');
    const resultArea = document.getElementById('result-area');
    const resultNumbersContainer = document.getElementById('result-numbers');

    const colors = ["#ff6b6b", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#f8961e", "#277da1", "#f94144"];
    let currentRotation = 0;
    let isSpinning = false;

    // ✅ MODIFIED: This function handles both setting the canvas size and drawing.
    function setupAndDrawWheel() {
        // Get the actual width of the container element
        const size = wheelContainer.clientWidth;
        // Set the canvas drawing buffer size to match its display size for crisp graphics
        canvas.width = size;
        canvas.height = size;
        
        // Now draw the wheel with the correct max number
        drawWheel(parseInt(maxNumberInput.value, 10));
    }

    // ✅ MODIFIED: All drawing calculations are now relative to the canvas size.
    function drawWheel(maxNumber) {
        // Dynamic calculations based on current canvas size
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (maxNumber <= 0 || isNaN(maxNumber)) return;

        const arcSize = 2 * Math.PI / maxNumber;
        const textRadius = radius * 0.8; // Position text at 80% of the radius
        const fontSize = Math.min(radius / 7, 18); // Dynamic font size

        for (let i = 0; i < maxNumber; i++) {
            const angle = i * arcSize;
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = `bold ${fontSize}px Jua`;
            ctx.translate(centerX + textRadius * Math.cos(angle + arcSize / 2), centerY + textRadius * Math.sin(angle + arcSize / 2));
            ctx.rotate(angle + arcSize / 2 + Math.PI / 2);
            ctx.fillText(i + 1, -ctx.measureText(i + 1).width / 2, 0);
            ctx.restore();
        }
    }

    function spinWheel() {
        if (isSpinning) return;
        
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

        isSpinning = true;
        resultArea.classList.add('hidden');
        setupAndDrawWheel(); // Ensure wheel is drawn correctly before spin

        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const randomAngle = Math.random() * 360;
        currentRotation += (360 * randomSpins) + randomAngle;
        
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        // Using a timeout that matches the CSS transition duration
        setTimeout(() => {
            isSpinning = false;
            
            const results = new Set();
            while(results.size < drawCount) {
                const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
                results.add(randomNumber);
            }
            
            // ✅ IMPROVED: Sort numbers before displaying
            const sortedResults = Array.from(results).sort((a, b) => a - b);
            displayResults(sortedResults);

        }, 5000); // 5000ms = 5s (matches the CSS transition)
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
    
    // --- Setup Event Listeners ---
    spinButton.addEventListener('click', spinWheel);
    
    // ✅ MODIFIED: Redraw the wheel whenever the number input changes.
    maxNumberInput.addEventListener('input', setupAndDrawWheel);

    // ✅ ADDED: Add a resize listener to make it responsive if the window size changes.
    window.addEventListener('resize', setupAndDrawWheel);

    // ✅ MODIFIED: Initial drawing of the wheel on page load.
    setupAndDrawWheel();
});
