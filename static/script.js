let currentNumber = 1;
number_to_animal = {
    1: "cat",
    2: "horse",
    3: "lion",
    4: "cow",
    5: "duck",
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
    cancelAudioPlay()
    currentNumber = (currentNumber % 5) + 1;
    numberButton = document.getElementById('numberButton');
    numberButton.textContent = number_to_animal[currentNumber];
    setColors(currentNumber)
}

function selection() {
    // Speak the current number  
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

let audio = null;  // Declare the audio object outside the function to track it globally
let isAudioPlaying = false;  // Track if audio is currently playing

function speakAnimal(number) {
    if (isAudioPlaying) {
        console.log("Audio is already playing. Ignoring new request.");
        return;  // Exit the function if audio is already playing
    }

    animal = number_to_animal[number];
    audio = new Audio(`static/sounds/${animal}.mp3`);

    // Set the flag to true when audio starts playing
    isAudioPlaying = true;

    // Play the audio
    audio.play();

    // When the audio ends, reset the flag
    audio.onended = function () {
        isAudioPlaying = false;
        console.log("Audio finished playing.");
    };
}

function cancelAudioPlay() {

    // Cancel the audio if it's playing
    if (audio && isAudioPlaying) {
        audio.pause();
        audio.currentTime = 0;  // Reset audio to the start
        isAudioPlaying = false;  // Update the flag
        console.log("Audio cancelled.");
    }
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