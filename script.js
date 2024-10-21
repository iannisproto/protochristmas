// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

function login(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    // Simple password check for demo purposes
    if (passwordInput === 'yourPassword') {
        loginError.textContent = '';
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('giftListContainer').style.display = 'block';
        document.getElementById('backgroundShapes').style.display = 'none'; // Hide circles
        loadGiftList(); // Load the user's gift list
    } else {
        loginError.textContent = 'Invalid password. Please try again.';
    }
}

function loadGiftList() {
    const userId = 'defaultUser'; // Handle user ID for demo purposes
    const giftListRef = database.ref('giftLists/' + userId);
    
    giftListRef.on('value', (snapshot) => {
        const giftList = snapshot.val() || {};
        const giftListElement = document.getElementById('giftList');
        giftListElement.innerHTML = ''; // Clear the list
        
        for (const gift in giftList) {
            const li = document.createElement('li');
            li.textContent = giftList[gift];
            giftListElement.appendChild(li);
        }
    });
}

function addGift() {
    const newGiftInput = document.getElementById('newGift');
    const newGift = newGiftInput.value.trim();
    
    if (newGift) {
        const userId = 'defaultUser'; // Handle user ID for demo purposes
        const giftListRef = database.ref('giftLists/' + userId);
        
        giftListRef.child(newGift).set(newGift); // Store the new gift
        newGiftInput.value = ''; // Clear input
    }
}

function logout() {
    document.getElementById('giftListContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('backgroundShapes').style.display = 'block'; // Show circles again on logout
}
