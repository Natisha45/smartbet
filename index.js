document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  const saveBtn = document.getElementById('saveBtn');
  const message = document.getElementById('message');

  // YOUR GOOGLE APPS SCRIPT URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9KJHYA21sAjhnDNqmjsSjrpCoRmV2I_1kow5R6lI-q1mnlM0pU-GF7f9aaEIGOsqH/exec';

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
      <div class="countdown-header">🎯 የወሩ እድል ይቆማል!</div>
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
      </div>
    `;
    document.body.insertBefore(countdownContainer, document.body.firstChild);
    
    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  function updateCountdown() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const timeLeft = endOfMonth - now;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
    document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
  }

  phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 10) {
      this.value = this.value.slice(0, 10);
    }
  });

  saveBtn.addEventListener('click', async () => {
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

    // First check if number exists in Google Sheets
    await checkAndSubmitNumber(cleanPhone);
  });

  async function checkAndSubmitNumber(phoneNumber) {
    showMessage("🔍 ቁጥር እየተፈተሸ...", "loading");

    try {
      // First check if number exists
      const checkResponse = await fetch(GOOGLE_SCRIPT_URL + `?action=check&phone=${encodeURIComponent(phoneNumber)}`);
      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        showMessage("⚠️ ይህ ቁጥር አስቀድሞ ተመዝግቧል!", "error");
        return;
      }

      // If number doesn't exist, proceed with countdown and submission
      showMessage("🎯 እየተረጋገጠ...", "loading");
      
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        if (countdown > 0) {
          showMessage(`🎯 ${countdown}...`, "loading");
          countdown--;
        } else {
          clearInterval(countdownInterval);
          submitNumberToSheets(phoneNumber);
        }
      }, 800);

    } catch (error) {
      console.error('Error checking number:', error);
      showMessage("❌ አይነታዊ ስህተት ተከስቷል", "error");
    }
  }

  async function submitNumberToSheets(phoneNumber) {
    showMessage("📡 በማስቀመጥ ላይ...", "loading");

    try {
      const submitResponse = await fetch(GOOGLE_SCRIPT_URL + `?action=submit&phone=${encodeURIComponent(phoneNumber)}`);
      const submitResult = await submitResponse.json();

      if (submitResult.success) {
        showMessage("✅ ተመዝግቧል!", "success");
        createConfetti();
        setTimeout(() => {
          phoneInput.value = "";
          showCongratulationsPopup();
        }, 1500);
      } else {
        showMessage("⚠️ " + submitResult.message, "error");
      }
    } catch (error) {
      console.error('Error submitting number:', error);
      showMessage("❌ አይነታዊ ስህተት ተከስቷል", "error");
    }
  }

  function showCongratulationsPopup() {
    const popup = document.createElement('div');
    popup.className = 'congratulations-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">🎉 CONGRATULATIONS! 🎉</div>
        <div class="popup-icon">🏆</div>
        <div class="popup-message">
          <p><strong>You are one of the few chosen ones!</strong></p>
          <p>Your number has been selected for our special prize draw.</p>
          <p>Good luck! We'll contact you if you win!</p>
        </div>
        <button class="popup-close" onclick="this.parentElement.parentElement.remove()">Close</button>
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
