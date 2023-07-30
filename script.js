// Function to detect if the user is on a mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Redirect to mobile.html if the user is on a mobile device
if (isMobileDevice()) {
    window.location.href = 'mobile.html';
}

function getRandomCharacter() {
    // Customize the characters as needed
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters[Math.floor(Math.random() * characters.length)];
}

function updateCharacterWithRandomTime(character) {
    setTimeout(() => {
        character.textContent = getRandomCharacter();
        updateCharacterWithRandomTime(character);
    }, Math.random() * 500 + 500); // Random time between 0.5 and 1 second (500ms to 1000ms)
}

const previousPositions = new Set();

function createArray() {
    const spawnGrid = document.querySelector('.spawn-grid');
    const arrayContainer = document.createElement('div');
    arrayContainer.classList.add('array');
    const arrayLength = Math.floor(Math.random() * 31) + 15; // Random length between 15 and 45 characters
    for (let i = 0; i < arrayLength; i++) {
        const character = document.createElement('div');
        character.textContent = getRandomCharacter();
        character.classList.add('character');
        arrayContainer.appendChild(character);
        updateCharacterWithRandomTime(character); // Start updating the character with random time
    }

    const columnsCount = Math.floor(window.innerWidth / 36); // Calculate the number of columns in the spawn grid
    let columnIndex;

    // Generate a new position until a unique one is found (not occupied in the previous 5 seconds)
    do {
        columnIndex = Math.floor(Math.random() * columnsCount); // Random column index for the array
    } while (previousPositions.has(columnIndex));

    // Calculate the left position for the array based on the column index and width
    const arrayWidth = (arrayLength * 20) + ((arrayLength - 1) * 4);
    let leftPosition = columnIndex * 36 + 2; // 36 = 32px column width + 4px gap, 2px gap on the left

    arrayContainer.style.left = leftPosition + 'px'; // Set the left position

    // Set falling speed (animation duration) for the array
    const isSlowArray = Math.random() < 0.5; // 50% chance of being a slow array
    arrayContainer.style.animationDuration = isSlowArray ? '15s' : '10s';

    spawnGrid.appendChild(arrayContainer);

    // Remove the array after its lifetime is over
    setTimeout(() => {
        arrayContainer.remove();
        // Reset the position after 5 seconds
        previousPositions.delete(columnIndex);
    }, parseFloat(arrayContainer.style.animationDuration) * 1000);

    // Add the new position to the set of previous positions
    previousPositions.add(columnIndex);
    // Reset the position after 5 seconds
    setTimeout(() => {
        previousPositions.delete(columnIndex);
    }, 10000);
}

let isPageVisible = true; // Track whether the page is currently visible

// Pause the array creation interval when the page becomes inactive
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        isPageVisible = true;
    } else {
        isPageVisible = false;
        clearAllArrays();
    }
});

function clearAllArrays() {
    const arrays = document.querySelectorAll('.array');
    arrays.forEach(array => array.remove());
}

function createArraysWhileVisible() {
    if (isPageVisible) {
        createArray();
        createArray();
        createArray();
        createArray();
        createArray();
    }
}

// Create new arrays every Xms (adjusted to slow down the falling rate)
setInterval(createArraysWhileVisible, 2000);

// Attach event listener to the login button click
const loginButton = document.querySelector('.login-button');
loginButton.addEventListener('click', function (event) {
    event.preventDefault();
});

function encryptPassword(password) {
    // Use js-sha256 library to compute the sha256 hash of the password
    return sha256(password);
}

function encryptUsername(username) {
    // Use js-sha256 library to compute the sha256 hash of the username
    return sha256(username);
}

function loginUser() {

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    // Encrypt the provided username and password
    const encryptedUsername = sha256(username); // Use sha256() for username
    const encryptedPassword = sha256(password); // Use sha256() for password

    // Replace these hardcoded encrypted values with actual stored encrypted values
    const storedEncryptedUsername = '0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90';
    const storedEncryptedPassword = 'dc8659db6d416dc32fcad510cc921af3c7eaf1176ddedfbe050ecf708fbac087';

    // Compare the encrypted credentials
    if (encryptedUsername === storedEncryptedUsername && encryptedPassword === storedEncryptedPassword) {
        // Redirect to main.html on successful login
        window.location.href = 'main.html';
    } else {
        // Clear the input fields after clicking the button
        document.getElementById('loginForm').reset();
        const fallingLetters = document.querySelectorAll('.character');
        fallingLetters.forEach(letter => {
            letter.classList.add('flash-red');

            // Remove the "flash-red" class after a short duration to stop the flashing effect
            setTimeout(() => {
                letter.classList.remove('flash-red');
            }, 300);
        });
    }
}
