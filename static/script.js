let currentNumber = 1;

// Function to cycle numbers and update button text
function cycleNumber() {
    currentNumber = (currentNumber % 5) + 1;
    document.getElementById('numberButton').textContent = currentNumber;

    // Speak the current number
    setColors(currentNumber)
    speakNumber(currentNumber);
}

// Function to use speech synthesis to speak the number with child-like voice properties
function speakNumber(number) {
    const utterance = new SpeechSynthesisUtterance(number);

    // Modify the properties to sound more like a child's voice
    utterance.pitch = 1.9;  // Higher pitch, range is from 0 to 2 (default is 1)
    utterance.rate = 0.3; // Slightly faster speaking rate, range is from 0.1 to 10 (default is 1)

    // Speak the number
    speechSynthesis.speak(utterance);
}

function setColors(currentNumber) {
    fetch('/set_colors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getPixelsForNumber(currentNumber))
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        alert('Error:' + error);
    });
}

function getPixelsForNumber(num) {

    NUM_PIXELS = 40;
    WHITE = [255, 255, 255];
    BLACK = [0, 0, 0];

    PIXELS_TO_COLOR = {
        1: [5, 6],
        2: [10, 11],
        3: [15, 16],
        4: [20, 21],
        5: [25, 26]
    }

    // Initialize with Black
    pixels = new Array(NUM_PIXELS).fill(BLACK);

    PIXELS_TO_COLOR[num].forEach((pos) => {
        pixels[pos] = WHITE;
    })

    return pixels;
}



// Attach click event to the button
document.getElementById('numberButton').addEventListener('click', cycleNumber);