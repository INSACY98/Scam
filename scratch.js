document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('scratchCard');
    const ctx = canvas.getContext('2d');
    
    let isScratching = false;
    let isSerialNumberRevealed = false;

     // Generate a random serial number
    const serialNumber = generateRandomSerialNumber();

    // Initial gray cover
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopScratch);

    // Touch event listeners
    canvas.addEventListener('touchstart', startScratch, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault(); // Prevent scrolling
        scratch(e);
    }, { passive: false });
    canvas.addEventListener('touchend', stopScratch);

    

    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    function generateRandomSerialNumber() {
        const characters = '0123456789';
        let serial = '';
        for (let i = 0; i < 12; i++) {
            serial += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return serial;
    }

    function startScratch(e) {
        isScratching = true;
        scratch(e);
    }

    function scratch(e) {
        if (isScratching) {
            const rect = canvas.getBoundingClientRect();
            let mouseX = e.clientX - rect.left;
            let mouseY = e.clientY - rect.top;

            // Adjust for touch events
            if (e.touches && e.touches.length === 1) {
                mouseX = e.touches[0].clientX - rect.left;
                mouseY = e.touches[0].clientY - rect.top;
            }

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2, false);
            ctx.fill();
        }
    }

    function stopScratch() {
        isScratching = false;

        // Check if enough has been scratched
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const transparentPixels = Array.from(pixels.data).filter((value, index) => index % 4 === 3 && value === 0).length;

        if (transparentPixels / (canvas.width * canvas.height) > 0.25) { 
            revealSerialNumber();
        }
    }

    function revealSerialNumber() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText(serialNumber, canvas.width / 2, canvas.height / 2 + 6);
    }
});
