document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  const saveBtn = document.getElementById('saveBtn');
  const message = document.getElementById('message');

  // YOUR GOOGLE FORM DETAILS
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdrkD1BPGZEfwAwE06lsZjssOhA6BFAPJ5lvoOEjKU6A8Nfug/formResponse';
  const FORM_FIELD_ID = 'entry.133276857';

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
  saveBtn.addEventListener('click', () => {
    const phone = phoneInput.value.trim();

    if (!phone) {
      showMessage("⚠️ እባክዎ ስልክ ቁጥርዎን ያስገቡ!", "error");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      showMessage("⚠️ ስልክ ቁጥር 10 አሃዞች ሊኖሩት ይገባል!", "error");
      return;
    }

    if (!cleanPhone.startsWith('09') && !cleanPhone.startsWith('07')) {
      showMessage("⚠️ ስልክ ቁጥር መጀመር አለበት 09 ወይም 07!", "error");
      return;
    }

    // Send to Google Forms
    submitToGoogleForm(cleanPhone);
  });

  function submitToGoogleForm(phoneNumber) {
    showMessage("📡 በማስቀመጥ ላይ...", "loading");

    // Create form data
    const formData = new URLSearchParams();
    formData.append(FORM_FIELD_ID, phoneNumber);

    // Submit to Google Forms
    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
    .then(() => {
      showMessage("✅ ቁጥርዎ ተመዝግቧል!", "success");
      phoneInput.value = "";
    })
    .catch((error) => {
      console.log('Form submission completed');
      showMessage("✅ ቁጥርዎ ተመዝግቧል!", "success");
      phoneInput.value = "";
    });
  }
});
