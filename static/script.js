document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    let stream;
    
class DragRect {
    constructor(posCenter, size = [200, 200]) {
        this.posCenter = posCenter;
        this.size = size;
        this.dragging = false;
    }

    update(cursor) {
        if (this.dragging) {
            this.posCenter = cursor;
        }
    }

    draw(ctx) {
        const [cx, cy] = this.posCenter;
        const [w, h] = this.size;
        ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
    }

    isPointInside(point) {
        const [px, py] = point;
        const [cx, cy] = this.posCenter;
        const [w, h] = this.size;
        return px > cx - w / 2 && px < cx + w / 2 && py > cy - h / 2 && py < cy + h / 2;
    }
}



    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const rectList = [];
    for (let x = 0; x < 5; x++) {
        rectList.push(new DragRect([x * 250 + 150, 150]));
    }

    startButton.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();
            console.log('Camera started');
            const camera = new Camera(video, {
                onFrame: async () => {
                    await hands.send({ image: video });
                },
                width: 640,
                height: 480
            });
            camera.start();
        }
    });

    stopButton.addEventListener('click', () => {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            console.log('Camera stopped');
        }
    });

    function onResults(results) {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
                drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });

                const thumbTip = landmarks[4];
                const indexTip = landmarks[8];
                const thumbX = thumbTip.x * canvas.width;
                const thumbY = thumbTip.y * canvas.height;
                const indexX = indexTip.x * canvas.width;
                const indexY = indexTip.y * canvas.height;
                const distance = Math.hypot(thumbX - indexX, thumbY - indexY);

                if (distance < 40) {
                    for (const rect of rectList) {
                        if (rect.isPointInside([indexX, indexY])) {
                            rect.dragging = true;
                            rect.update([indexX, indexY]);
                        } else {
                            rect.dragging = false;
                        }
                    }
                }
            }
        }

        for (const rect of rectList) {
            rect.draw(ctx);
        }
        ctx.restore();
    }
});


