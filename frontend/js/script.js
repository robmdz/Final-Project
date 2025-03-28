import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Función para obtener las credenciales desde el backend
async function getSupabaseCredentials() {
    try {
        const response = await fetch("http://127.0.0.1:8000/supabase-keys");
        if (!response.ok) throw new Error("Error obteniendo credenciales");
        
        const data = await response.json();
        console.log("Credenciales recibidas:", data);

        // Inicializar Supabase con las credenciales del backend
        return createClient(data.SUPABASE_URL, data.SUPABASE_KEY);
    } catch (error) {
        console.error("Error:", error);
    }
}

let supabase;
getSupabaseCredentials().then(client => {
    supabase = client;
    console.log("Supabase inicializado:", supabase);
});


// Fetch user data from FastAPI backend
async function fetchUserData() {
    const response = await fetch("http://localhost:8000/get-supabase-data");
    const data = await response.json();
    console.log("User Data:", data);
}
fetchUserData();

async function uploadImage(file) {
    const { data, error } = await supabase
        .storage
        .from('profileimage') // Change 'images' to your Supabase storage bucket name
        .upload(`signatures/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error("Error uploading image:", error);
        throw error;
    }

    return data ? supabase.storage.from('profileimage').getPublicUrl(data.path).publicUrl : null;
}

const canvas = document.getElementById("signature-pad");
const signaturePad = new SignaturePad(canvas);


document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the signature as an image
    const signatureImage = getSignatureImage();

    // Convert Base64 to Blob
    const blob = await fetch(signatureImage).then(res => res.blob());

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from("signature-pad")
        .upload(`signature_${Date.now()}.png`, blob, { contentType: "image/png" });

    if (error) {
        console.error("❌ Error uploading signature:", error);
        return;
    }

    console.log("✅ Signature uploaded:", data.path);
});

function getSignatureImage() {
    if (!signaturePad || signaturePad.isEmpty()) {
        alert("Please provide a signature.");
        return null;
    }
    return signaturePad.toDataURL(); // Returns image as Base64
}

if (typeof signaturePad === "undefined") {
    console.error("signaturePad is not initialized.");
}

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("signature-pad");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    // Initialize SignaturePad
    const signaturePad = new SignaturePad(canvas);

    // Clear button functionality
    document.getElementById("clear-signature").addEventListener("click", function () {
        signaturePad.clear();
    });
});



async function signUp(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const lastName = document.getElementById("last_name").value;
    const phoneNumber = document.getElementById("phone_number").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Convert signature to image (Base64)
    const signatureData = signaturePad.toDataURL("image/png");

    // Upload profile image
    const imageFile = document.getElementById("image-upload").files[0];
    let imageUrl = null;
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    // Send data to FastAPI backend
    const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            name,
            lastName,
            phoneNumber,
            signature: signatureData,
            profile_image: imageUrl
        })
    });

    //const result = await response.json();
    //if (result.error) {
      //  document.getElementById("error-message").innerText = result.error.message;
    //} else {
      //  alert("Sign-up successful! Check your email to verify.");
    //}
}

document.getElementById("signup-form")?.addEventListener("submit", signUp);



async function fetchUserById(userId) {
    let { data, error } = await supabaseClient
        .from("Users") 
        .select("*") 
        .eq("id", userId)
        .single(); 

    if (error) {
        console.error("Error fetching user:", error);
        document.getElementById("userList").innerHTML = `<p style="color:red;">User not found.</p>`;
        return;
    }

    displayUser(data);
}

function displayUser(user) {
    const userList = document.getElementById("userList");
    userList.innerHTML = ""; 

    let userElement = document.createElement("p");
    userElement.textContent = `ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Nivel de verificación: ${user.phone}`;
    userList.appendChild(userElement);
}

function searchUser() {
    const userId = document.getElementById("userId").value;
    if (userId) {
        fetchUserById(userId);
    } else {
        alert("Please enter a valid User ID");
    }
}