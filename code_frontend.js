// Initialize Supabase
const SUPABASE_URL = "https://sdgcjokqpviclqnaahng.supabase.co";  // Replace with your Supabase URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZ2Nqb2txcHZpY2xxbmFhaG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwOTM3MTMsImV4cCI6MjA1NzY2OTcxM30.HZ1IzvUjR4yqwDinJJUGGACz302VJEixio1ZmAP7iFM";  // Replace with your Supabase key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to fetch users
async function fetchUsers() {
    let { data, error } = await supabase.from("users").select("*");

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    // Display users in HTML
    let usersDiv = document.getElementById("users");
    usersDiv.innerHTML = "";  // Clear previous content

    data.forEach(user => {
        let p = document.createElement("p");
        p.textContent = `👤 ${user.name} - 📧 ${user.email}`;
        usersDiv.appendChild(p);
    });
}
