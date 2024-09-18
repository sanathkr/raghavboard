let currentNumber = 1;
number_to_animal = {
    1: "cat",
    2: "cow",
    3: "duck",
    4: "horse",
    5: "lion",
}


document.addEventListener('keydown', function(event) {
    if (event.code === 'Enter') {
        console.log('Enter key pressed');
        scanning()

    } else if (event.code === 'Space') {
        console.log('Space key pressed');
        // Add your action for Space key here
        selection()
    }
});

// Function to cycle numbers and update button text
function scanning() {
    currentNumber = (currentNumber % 5) + 1;
    numberButton = document.getElementById('numberButton');
    numberButton.textContent = number_to_animal[currentNumber];
}

function selection() {
    // Speak the current number
    setColors(currentNumber)
    speakAnimal(currentNumber);
    // speakNumber(currentNumber);
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

function speakAnimal(number) {

    animal = number_to_animal[number];
    const audio = new Audio(`static/sounds/${animal}.mp3`);
    audio.play();
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
        5: [8, 9],
        4: [14, 15],
        3: [20, 21],
        2: [25, 26],
        1: [31, 32],
    }

    // Initialize with Black
    pixels = new Array(NUM_PIXELS).fill(BLACK);

    PIXELS_TO_COLOR[num].forEach((pos) => {
        pixels[pos] = WHITE;
    })

    return pixels;
}



// Attach click event to the button
document.getElementById('numberButton').addEventListener('click', selection);