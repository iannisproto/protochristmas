// Initialize Supabase client
const supabaseUrl = 'https://bxolcjhxlttrdbdipopa.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4b2xjamh4bHR0cmRiZGlwb3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0MzczNjgsImV4cCI6MjA0NTAxMzM2OH0.CpEyTjh0Td7Sts9t5LY8FUNR9cgiH0wPp5iTzNwIbGc'; // Replace with your Supabase anon key
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
    const { user } = await supabase.auth.getUser();
    const userId = user.id; // Get the currently authenticated user's ID

    const { data: gifts, error } = await supabase
        .from('gifts')
        .select('*')
        .neq('user_id', userId); // Only load gifts that do not belong to the current user
    
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

    if (newGift) {
        const { user } = await supabase.auth.getUser();
        const userId = user.id; // Get the currently authenticated user's ID
        
        const { data, error } = await supabase
            .from('gifts')
            .insert([{ user_id: userId, name: newGift }]);
        
        if (error) {
            console.error('Error adding gift:', error);
        } else {
            newGiftInput.value = ''; // Clear input
            loadGiftList(); // Reload the list after adding
        }
    }
}

function logout() {
    document.getElementById('giftListContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('backgroundShapes').style.display = 'block'; // Show circles again on logout
}

