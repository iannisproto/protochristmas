// Initialize Supabase client
const supabaseUrl = 'https://bxolcjhxlttrdbdipopa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4b2xjamh4bHR0cmRiZGlwb3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MzczNjgsImV4cCI6MjA0NTAxMzM2OH0.CpEyTjh0Td7Sts9t5LY8FUNR9cgiH0wPp5iTzNwIbGc'; // Replace with your Supabase key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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

async function addGift() {
    const newGiftInput = document.getElementById('newGift');
    const newGift = newGiftInput.value.trim();

    console.log("Adding gift:", newGift); // Log the gift being added

    if (newGift) {
        const userId = 'defaultUser'; // Change this to handle user IDs properly
        
        const { data, error } = await supabase
            .from('gifts')
            .insert([{ user_id: userId, name: newGift }]);
        
        if (error) {
            console.error('Error adding gift:', error);
        } else {
            console.log("Gift added successfully:", data); // Log the success
            newGiftInput.value = ''; // Clear input
            loadGiftList(); // Reload the list after adding
        }
    } else {
        console.log("No gift to add."); // Log if input is empty
    }
}

function logout() {
    document.getElementById('giftListContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('backgroundShapes').style.display = 'block'; // Show circles again on logout
}

