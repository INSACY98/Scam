document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('scratchCard');
    const ctx = canvas.getContext('2d');
    const serialNumber = generateRandomSerialNumber(); // Generate a random serial number

    // Initial gray cover
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let isScratching = false;

    // Mouse event listeners
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

            // Create a clipping mask to reveal the scratched areas
            ctx.save();
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2, false);
            ctx.clip();
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas to reveal underneath
            
            // Draw the serial number text
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(serialNumber, canvas.width / 2, canvas.height / 2);
            
            ctx.restore();
        }
    }

    function stopScratch() {
        isScratching = false;
    }

    function generateRandomSerialNumber() {
        const characters = '0123456789 ';
        let serial = '';
        for (let i = 0; i < 14; i++) {
            serial += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return serial;
    }
});
