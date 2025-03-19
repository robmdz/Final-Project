// ✅ Replace with your actual Supabase project credentials
const SUPABASE_URL = "https://sdgcjokqpviclqnaahng.supabase.co";  
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZ2Nqb2txcHZpY2xxbmFhaG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTM3MTMsImV4cCI6MjA1NzY2OTcxM30.HZ1IzvUjR4yqwDinJJUGGACz302VJEixio1ZmAP7iFM";  

// ✅ Initialize Supabase client correctly
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("✅ Supabase initialized:", supabase);

// ✅ Get form elements
const userForm = document.getElementById("userForm");
const usersDiv = document.getElementById("users");

// ✅ Function to insert data into Supabase
async function addUser(event) {
    event.preventDefault();  // Prevent form from refreshing the page

    const name = document.getElementById("name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const phone_number = document.getElementById("phone_number").value;
    const password = document.getElementById("password").value;

    // 🔹 Insert into Supabase
    const { data, error } = await supabase.from("Users").insert([{ name, last_name, email, phone_number, password }]);

    if (error) {
        console.error("❌ Error inserting user:", error);
    } else {
        console.log("✅ User added:", data);
        fetchUsers();  // Refresh the users list
    }

    // 🔹 Clear the form
    userForm.reset();
}

// ✅ Function to fetch and display users
async function fetchUsers() {
    let { data, error } = await supabase.from("Users").select("*");

    if (error) {
        console.error("❌ Error fetching users:", error);
        return;
    }

    usersDiv.innerHTML = "";  // Clear previous content

    data.forEach(user => {
        let p = document.createElement("p");
        p.textContent = `👤 ${user.name} - 📧 ${user.email}`;
        usersDiv.appendChild(p);
    });
}

// ✅ Listen for form submit
userForm.addEventListener("submit", addUser);

// ✅ Load users when the page loads
fetchUsers();

