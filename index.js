window.onload = function() {
    let version = 'beta'
    console.log(`Welcome to Quorixor Version: ${version}`);

    verify_legit_user();
}

const verify_protocol = false;


let current_device = [];
let window_data = [];


const ERRORS = {
    0: "::UNKNOWN_ERROR",
    1: "::VERIFY_FAILED",
    2: "::WEBSOCKET_CLOSED",
    3: "::WEBSOCKET_FAILED",
}

const change_logs = {
    beta: [
        date = '10/17/2024',
        "Quorixor official birth: 10/17/2024",
    ]
}

function verify_legit_user() {

    if (verify_protocol === false) return verify_completed(true);

    const token = `#` + Math.floor(Math.random() * 999)
    let response = prompt(`Type '${token}' below`);

    if (!response) return verify_completed(false);
    if (response === token) {
        return verify_completed(true);
    } else {
        return verify_completed(false);
    }
}

function verify_completed(status) {
    if (status === false) {
        console.log(`${ERRORS[1]}`)
    } else {
        init_start_up();
    }
}

window.addEventListener('resize', function(e) {
    window_data.width = window.innerWidth;
    window_data.height = window.innerHeight;
})

function init_start_up() {
    const DOM = document.body;
    if (!DOM) return console.log(`${ERRORS[0]}`), init_start_up();

    let device = /Mobi|Android/i.test(navigator.userAgent);

    let device_data = {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.devicePixelRatio,
        device: device ? 'mobile' : 'PC',
    }
    current_device.push(device_data);

}

function showSection(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
    });
    document.getElementById(section).classList.remove('hidden');
}

document.querySelector('.settings-button').addEventListener('click', () => {
    showSection('settings');
});

function closeSettings() {
    showSection('play'); 
}

const client_packets = {
    0: "REQUEST_P2P_LOBBIES",
};

const server_packets = {
    0: "P2P_LOBBIES",
};

let lobbies = [];


const WebSocket_Token = `key${Math.floor(Math.random() * 1000)}Quix`

const Server = new WebSocket('ws://localhost:3009?token=' + WebSocket_Token);

Server.addEventListener('open', () => {
    console.log('Successful Connection.');
});

document.getElementById('start-game').onclick = function() {
    const fetchingScreen = document.getElementById('fetching_loading');
    document.getElementById('start-game').style.pointerEvents = 'none'; // Disable button
    fetchingScreen.classList.remove('hidden'); // Show loading message

    Server.send(client_packets[0]); // Sending a request to the server
};

Server.onmessage = function(event) {
    const message = event.data; // Get the raw message

    try {
        if (message === "HELLO_FROM_SERVER") {
            // Handle the initial hello message if needed
            console.log(message);
        } else {
            // Otherwise, parse the incoming JSON
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.type === server_packets[0]) { // Check for the expected response
                const fetchingScreen = document.getElementById('fetching_loading');
                fetchingScreen.classList.add('hidden'); // Hide loading message

                lobbies = parsedMessage.data; // Access the lobbies data
                console.log('Lobbies received:', lobbies); // Display or process the message
            }
        }
    } catch (e) {
        console.error('Error parsing message:', e);
    }
};
