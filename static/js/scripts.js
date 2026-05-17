const paletteContainer = document.getElementById('palette');
const generateBtn = document.getElementById('generate-btn');
const cardCount = 5;

// Generate random hex color
function generateRandomColor() {
    const chars = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += chars[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Calculate luminance to decide black or white contrast text
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

// Generate the new Jenoptiks lens matrix
function synthesizeSpectrum() {
    paletteContainer.innerHTML = '';
    
    for (let i = 0; i < cardCount; i++) {
        const randomColor = generateRandomColor();
        const textColor = getContrastColor(randomColor);
        
        const card = document.createElement('div');
        card.classList.add('color-card');
        card.style.backgroundColor = randomColor;
        card.style.color = textColor;
        
        card.innerHTML = `
            <span class="color-code">${randomColor}</span>
            <span class="copy-text">Click to Capture</span>
        `;
        
        card.addEventListener('click', () => captureColor(randomColor, card));
        
        paletteContainer.appendChild(card);
    }
}

// Copy color data to system clipboard
async function captureColor(text, card) {
    try {
        await navigator.clipboard.writeText(text);
        const copyTextEl = card.querySelector('.copy-text');
        const originalText = copyTextEl.innerText;
        
        copyTextEl.innerText = 'Captured!';
        setTimeout(() => {
            copyTextEl.innerText = originalText;
        }, 1000);
    } catch (err) {
        console.error('Data capture failed: ', err);
    }
}

// Global Triggers
generateBtn.addEventListener('click', synthesizeSpectrum);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); 
        synthesizeSpectrum();
    }
});

// Boot application
synthesizeSpectrum();
