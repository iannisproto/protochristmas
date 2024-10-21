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

const { createClient } = supabase;
const supabaseUrl = 'https://bxolcjhxlttrdbdipopa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4b2xjamh4bHR0cmRiZGlwb3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MzczNjgsImV4cCI6MjA0NTAxMzM2OH0.CpEyTjh0Td7Sts9t5LY8FUNR9cgiH0wPp5iTzNwIbGc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addGift() {
    const newGiftInput = document.getElementById('newGift');
    const newGift = newGiftInput.value.trim();

    if (newGift) {
        const userId = 'defaultUser'; // Change this to handle user IDs properly
        
        const { data, error } = await supabase
            .from('gifts')
            .insert([{ user_id: userId, name: newGift }]);
        
        if (error) {
            console.error('Error adding gift:', error);
        } else {
            newGiftInput.value = ''; // Clear input
        }
    }
}

async function loadGiftList() {
    const userId = 'defaultUser'; // Change this to handle user IDs properly
    
    const { data: gifts, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('user_id', userId);
    
    if (error) {
        console.error('Error loading gifts:', error);
        return;
    }

    const giftListElement = document.getElementById('giftList');
    giftListElement.innerHTML = ''; // Clear the list
    
    gifts.forEach(gift => {
        const li = document.createElement('li');
        li.textContent = gift.name; // Use gift name
        giftListElement.appendChild(li);
    });
}

