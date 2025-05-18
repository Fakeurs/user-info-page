const filePicker = document.querySelector("#file-picker");
const cameraIcon = document.querySelector(".file-picker-icon");
const profilePicture = document.querySelector("#profile-picture")


// Open file picker
cameraIcon.addEventListener('click', () => {
    filePicker.click();
});

// Process choosen file
filePicker.addEventListener("change", (e) => {
    // Send to server
    const fileObject = e.target.files[0];
    updateProfilePicture(fileObject);

})



async function updateProfilePicture(fileObject) {
    const formData = new FormData();

    // Append file
    formData.append("profilePic", fileObject)
    try {
        const response = await fetch("/profile-info/api/change-profile-picture", {
        method: "POST",
        body: formData
    });
    const data = await response.json()
    const imageSource = `./Uploads/${data.uploadPath}`
    profilePicture.src = imageSource;

    } catch (error) {
        console.error(error);
    }

}

// Load profile picture
async function loadProfilePicture(username) {
  try {
    const response = await fetch("/profile-info/api/profile-picture");
    const data = await response.json();
    const imageSource = `./Uploads/${data.profilePic}`;
    profilePicture.src = imageSource;
  } catch (error) {
    console.error(error);
  }
}



// === Edit Personal Info ===
const personalInfoContainer = document.querySelector(".edit-container-personal-info");

personalInfoContainer.addEventListener("click", function () {
  const isEditing = personalInfoContainer.classList.toggle("save-mode");

  const personalFields = [
    { className: "first-name", label: "First name" },
    { className: "last-name", label: "Last name" },
    { className: "email", label: "Email" },
    { className: "phone-number", label: "Phone number" }
  ];

  if (isEditing) {
    // Switch to input fields
    personalFields.forEach(field => {
      const container = document.querySelector("." + field.className);
      const currentValue = container.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
      input.className = "edit-input " + field.className;
      container.replaceWith(input);
    });

    personalInfoContainer.querySelector("span").textContent = "Save";
  } else {
    // Save inputs and replace with divs
    personalFields.forEach(field => {
      const input = document.querySelector("input." + field.className);
      const newValue = input.value;
      const div = document.createElement("div");
      div.className = field.className;
      div.textContent = newValue;
      input.replaceWith(div);
    });

    personalInfoContainer.querySelector("span").textContent = "Edit";

    // Update full name display
    const updatedFirstName = document.querySelector(".first-name").textContent;
    const updatedLastName = document.querySelector(".last-name").textContent;
    const fullNameDisplay = document.querySelector(".full-name");
    if (fullNameDisplay) {
      fullNameDisplay.textContent = `${updatedFirstName} ${updatedLastName}`;
    }

    // Prepare data to send
    const personalData = {};
    personalFields.forEach(field => {
      personalData[field.className] = document.querySelector(`.${field.className}`).textContent;
    });

    // Send fetch request with personal info JSON
    fetch('/profile-info/api/update-personal-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ personalInfo: personalData })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save personal info');
      return res.json();
    })
    .then(data => {
      console.log('Personal info saved:', data);
      // Optional: show a success message or update UI accordingly
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Error saving personal info.');
    });
  }
});

// === Edit Address Info ===
const addressContainer = document.querySelector(".edit-container-address");

addressContainer.addEventListener("click", function () {
  const isEditing = addressContainer.classList.toggle("save-mode");

  const addressFields = [
    { className: "country", label: "Country" },
    { className: "city", label: "City" }
  ];

  if (isEditing) {
    addressFields.forEach(field => {
      const container = document.querySelector("." + field.className);
      const currentValue = container.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
      input.className = "edit-input " + field.className;
      container.replaceWith(input);
    });

    addressContainer.querySelector("span").textContent = "Save";
  } else {
    addressFields.forEach(field => {
      const input = document.querySelector("input." + field.className);
      const newValue = input.value;
      const div = document.createElement("div");
      div.className = field.className;
      div.textContent = newValue;
      input.replaceWith(div);
    });

    addressContainer.querySelector("span").textContent = "Edit";

    // Update location display
    const updatedCity = document.querySelector(".city").textContent;
    const updatedCountry = document.querySelector(".country").textContent;
    const locationDisplay = document.querySelector(".location");
    if (locationDisplay) {
      locationDisplay.textContent = `${updatedCity}, ${updatedCountry}`;
    }

    // Prepare data to send
    const addressData = {};
    addressFields.forEach(field => {
      addressData[field.className] = document.querySelector(`.${field.className}`).textContent;
    });

    // Send fetch request with address info JSON
    fetch('/profile-info/api/update-address-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ addressInfo: addressData })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save address info');
      return res.json();
    })
    .then(data => {
      console.log('Address info saved:', data);
      // Optional: show a success message or update UI accordingly
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Error saving address info.');
    });
  }
});

// Helper function to set text content of element by selector
function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

// Fetch and populate personal info
async function loadPersonalInfo() {
  try {
    const response = await fetch("/profile-info/api/personal-info");
    if (!response.ok) throw new Error("Failed to fetch personal info");

    const data = await response.json();
    const personalInfo = data.personalInfo;

    setText(".first-name", personalInfo["first-name"] || "");
    setText(".last-name", personalInfo["last-name"] || "");
    setText(".email", personalInfo.email || "");
    setText(".phone-number", personalInfo["phone-number"] || "");

    // Update full name display
    const fullNameDisplay = document.querySelector(".full-name");
    if (fullNameDisplay) {
      fullNameDisplay.textContent = `${personalInfo["first-name"] || ""} ${personalInfo["last-name"] || ""}`.trim();
    }
  } catch (error) {
    console.error("Error loading personal info:", error);
  }
}


// Fetch and populate address info
async function loadAddressInfo() {
  try {
    const response = await fetch("/profile-info/api/address-info");
    if (!response.ok) throw new Error("Failed to fetch address info");

    const data = await response.json();
    const addressInfo = data.addressInfo;

    setText(".country", addressInfo.country || "");
    setText(".city", addressInfo.city || "");

    // Update location display
    const locationDisplay = document.querySelector(".location");
    if (locationDisplay) {
      locationDisplay.textContent = `${addressInfo.city || ""}, ${addressInfo.country || ""}`.replace(/^, |, $/g, '').trim();
    }
  } catch (error) {
    console.error("Error loading address info:", error);
  }
}


// Call both on page load
window.addEventListener("DOMContentLoaded", () => {
  loadPersonalInfo();
  loadAddressInfo();
  loadProfilePicture();
});
