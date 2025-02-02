document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const originalCanvas = document.getElementById('originalCanvas');
    const grayscaleCanvas = document.getElementById('grayscaleCanvas');
    const downloadBtn = document.getElementById('downloadBtn');
    
    imageInput.addEventListener('change', handleImage);
    downloadBtn.addEventListener('click', downloadGrayscaleImage);

    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Display original image
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                const ctxOriginal = originalCanvas.getContext('2d');
                ctxOriginal.drawImage(img, 0, 0);

                // Create grayscale version
                grayscaleCanvas.width = img.width;
                grayscaleCanvas.height = img.height;
                const ctxGrayscale = grayscaleCanvas.getContext('2d');
                ctxGrayscale.drawImage(img, 0, 0);
                
                // Get image data and convert to grayscale
                const imageData = ctxGrayscale.getImageData(0, 0, grayscaleCanvas.width, grayscaleCanvas.height);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;     // Red
                    data[i + 1] = avg; // Green
                    data[i + 2] = avg; // Blue
                }
                
                ctxGrayscale.putImageData(imageData, 0, 0);
                downloadBtn.disabled = false;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    function downloadGrayscaleImage() {
        const link = document.createElement('a');
        link.download = 'grayscale-image.png';
        link.href = grayscaleCanvas.toDataURL();
        link.click();
    }
}); 