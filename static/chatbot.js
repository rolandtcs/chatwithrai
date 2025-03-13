document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    const changeLangBtn = document.getElementById("change-lang-btn");
    const languageSelect = document.getElementById("language-select");

    let userLanguage = "English"; // Default language

    // ✅ Show language dropdown when clicking "Change Language" button
    changeLangBtn.addEventListener("click", function () {
        languageSelect.classList.toggle("hidden"); // Show/hide dropdown
    });

    // ✅ Change language when user selects from dropdown
    languageSelect.addEventListener("change", function () {
        userLanguage = languageSelect.value;
        addMessage("RAI", `Language changed to ${userLanguage}. How may I assist you?`, "ai");
        languageSelect.classList.add("hidden"); // Hide dropdown after selection
    });

    // ✅ Function to start conversation
    async function initiateConversation() {
        const initialMessage = "Hello! I'm RAI! How can I assist you today?";
        addMessage("RAI", initialMessage, "ai");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user");
        userInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Show Typing Bubble
        const typingBubble = addTypingBubble();
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, language: userLanguage }) // ✅ Send language preference to backend
            });

            const data = await response.json();
            removeTypingBubble(typingBubble); // ✅ Remove typing bubble

            if (data.reply) {
                addMessage("RAI", data.reply, "ai");
            } else {
                addMessage("RAI", "Sorry, something went wrong!", "ai");
            }
        } catch (error) {
            removeTypingBubble(typingBubble);
            addMessage("RAI", "Sorry, something went wrong!", "ai");
        }
    }

    function addMessage(sender, text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.innerHTML = `<strong>${sender}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✅ Function to Show Typing Bubble (WhatsApp Style)
    function addTypingBubble() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "typing-bubble");
        typingDiv.innerHTML = `<span class="typing-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </span>`;
        chatBox.appendChild(typingDiv);
        return typingDiv;
    }

    // ✅ Function to Remove Typing Bubble
    function removeTypingBubble(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);

    initiateConversation(); // ✅ Start chat
});
