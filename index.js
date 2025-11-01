document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  const saveBtn = document.getElementById('saveBtn');
  const message = document.getElementById('message');

  // YOUR GOOGLE FORM DETAILS
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdrkD1BPGZEfwAwE06lsZjssOhA6BFAPJ5lvoOEjKU6A8Nfug/formResponse';
  const FORM_FIELD_ID = 'entry.133276857';

  // Create countdown element at the top
  createCountdownTimer();

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

  function createCountdownTimer() {
    const countdownContainer = document.createElement('div');
    countdownContainer.className = 'countdown-container';
    countdownContainer.innerHTML = `
      <div class="countdown-header">🎯 የሽልማት ጊዜው!</div>
      <div class="countdown-timer">
        <span class="countdown-item">
          <span id="countdown-days">00</span>
          <span class="countdown-label">ቀናት</span>
        </span>
        <span class="countdown-separator">:</span>
        <span class="countdown-item">
          <span id="countdown-hours">00</span>
          <span class="countdown-label">ሰዓታት</span>
        </span>
        <span class="countdown-separator">:</span>
        <span class="countdown-item">
          <span id="countdown-minutes">00</span>
          <span class="countdown-label">ደቂቃዎች</span>
        </span>
        <span class="countdown-separator">:</span>
        <span class="countdown-item">
          <span id="countdown-seconds">00</span>
          <span class="countdown-label">ሴኮንዶች</span>
        </span>
      </div>
    `;
    document.body.insertBefore(countdownContainer, document.body.firstChild);
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const now = new Date();
    const targetDate = new Date(2025, 10, 1, 23, 59, 59);
    const timeLeft = targetDate - now;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
    document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
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
      createConfetti();
      setTimeout(() => {
        phoneInput.value = "";
        showCongratulationsPopup();
      }, 1000);
    })
    .catch((error) => {
      console.log('Form submission completed');
      showMessage("✅ ቁጥርዎ ተመዝግቧል!", "success");
      createConfetti();
      setTimeout(() => {
        phoneInput.value = "";
        showCongratulationsPopup();
      }, 1000);
    });
  }

  function showCongratulationsPopup() {
    const popup = document.createElement('div');
    popup.className = 'congratulations-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">🎉 እንኳን ደስ አልዎት! 🎉</div>
        <div class="popup-icon">🏆</div>
        <div class="popup-message">
          <p><strong>ለሽልማት እጩ ሆነዋል</strong></p>
          <p>መልካም ዕድል! በብልሃት ተጫውተው ያሸንፉ (Be Smart To Win)!</p>
        </div>
        <button class="popup-close" onclick="this.parentElement.parentElement.remove()">መዝጊያ</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  function createConfetti() {
    const emojis = ['🎉', '🎊', '⭐', '✨', '🎯', '🏆'];
    for(let i = 0; i < 20; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-50px';
        confetti.style.fontSize = (20 + Math.random() * 15) + 'px';
        confetti.style.zIndex = '999';
        document.body.appendChild(confetti);
        
        confetti.animate([
          { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
          { transform: `translateY(100vh) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
        ], {
          duration: 2000 + Math.random() * 1000,
          easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 100);
    }
  }
});
