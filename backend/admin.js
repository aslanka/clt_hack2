const adminTokenKey = 'admin_token'; // Key for storing admin token
const adminUserIdKey = 'admin_user_id'; // Key for storing admin user ID

// Function to handle admin login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const result = await response.json();
        const adminToken = result.token;
        const userId = result.userId; // Assuming the userId is returned in the login response
        alert('Login successful!');

        // Store the token and user ID in local storage
        localStorage.setItem(adminTokenKey, adminToken);
        localStorage.setItem(adminUserIdKey, userId);

        // Show the activity form and logout button after successful login
        document.getElementById('activityForm').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none'; // Hide login form
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    }
});

// Function to handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem(adminTokenKey); // Remove the token from local storage
    localStorage.removeItem(adminUserIdKey); // Remove the user ID from local storage
    document.getElementById('activityForm').style.display = 'none'; // Hide activity form
    document.getElementById('logoutButton').style.display = 'none'; // Hide logout button
    document.getElementById('loginForm').style.display = 'block'; // Show login form
});

// Function to handle form submission for adding activity
document.getElementById('activityForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the input values
    const activityType = document.getElementById('activityType').value;
    const description = document.getElementById('description').value;
    const points = parseInt(document.getElementById('points').value, 10);
    const userId = parseInt(document.getElementById('userId').value, 10);
    const adminToken = localStorage.getItem(adminTokenKey); // Get the stored admin token
 // Get the stored admin user ID
   
    try {
        const response = await fetch('http://localhost:3000/activities/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}` // Include the admin token in the headers
            },
            
            body: JSON.stringify({ userId, activityType, description, points }) // Include userId in the request body
        });

        if (!response.ok) {
            throw new Error('Error adding activity');
        }

        const result = await response.json();
        alert('Activity added successfully!');
        // Optionally, reset the form
        document.getElementById('activityForm').reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add activity. Please try again.');
    }
});
