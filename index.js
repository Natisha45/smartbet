document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  const saveBtn = document.getElementById('saveBtn');
  const message = document.getElementById('message');

  // REPLACE THIS WITH YOUR ACTUAL GOOGLE APPS SCRIPT URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9TrpAqHLQQZjZYgE3swwjbJFbfIugFSamNbVctX0/dev';

  // Define showMessage function FIRST
  function showMessage(text, type) {
    message.textContent = text;
    
    switch (type) {
      case "success":
        message.style.color = "lightgreen";
        break;
      case "error":
        message.style.color = "orange";
        break;
      case "loading":
        message.style.color = "yellow";
        break;
      default:
        message.style.color = "white";
    }
  }

  // Auto-format phone number input
  phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
    }
  });

  // Save button click event
  saveBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();

    if (!phone) {
      showMessage("⚠️ እባክዎ ስልክ ቁጥርዎን ያስገቡ!", "error");
      return;
    }

    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');

    // Validate phone number
    if (cleanPhone.length !== 10) {
      showMessage("⚠️ ስልክ ቁጥር 10 አሃዞች ሊኖሩት ይገባል!", "error");
      return;
    }

    if (!cleanPhone.startsWith('09') && !cleanPhone.startsWith('07')) {
      showMessage("⚠️ ስልክ ቁጥር መጀመር አለበት 09 ወይም 07!", "error");
      return;
    }

    // Send to Google Sheets
    await saveToGoogleSheets(cleanPhone);
  });

  async function saveToGoogleSheets(phoneNumber) {
    showMessage("📡 በማስቀመጥ ላይ...", "loading");

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber
        })
      });

      const result = await response.json();

      if (result.success) {
        showMessage("✅ ቁጥርዎ ተመዝግቧል!", "success");
        phoneInput.value = "";
        
        // Log the sheet URL for debugging
        if (result.sheetUrl) {
          console.log("Data saved in sheet:", result.sheetUrl);
        }
      } else {
        showMessage("❌ ስህተት: " + result.message, "error");
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage("❌ አይነታዊ ስህተት ተከስቷል", "error");
    }
  }
});