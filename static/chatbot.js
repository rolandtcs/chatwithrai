document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    const changeLangBtn = document.getElementById("change-lang-btn");

    // ✅ Load stored language or default to English
    let userLanguage = localStorage.getItem("selectedLanguage") || "English";
    changeLangBtn.value = userLanguage; // ✅ Ensure dropdown reflects stored language on load

    // ✅ Initial message
    async function initiateConversation() {
        addMessage("RAI", "Hello! I'm RAI! How can I assist you today?", "ai");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✅ Language confirmation messages
    const languageConfirmations = {
        "English": "Language changed to English. How may I assist you?",
        "Chinese": "语言已更改为中文。我可以如何帮助您？",
        "Malay": "Bahasa telah ditukar ke Melayu. Bagaimana saya boleh membantu anda?",
        "Tamil": "மொழி தமிழாக மாற்றப்பட்டது. நான் எப்படி உதவலாம்?"
    };

    // ✅ Change language and persist in `localStorage`
    changeLangBtn.addEventListener("change", function () {
        userLanguage = changeLangBtn.value;
        localStorage.setItem("selectedLanguage", userLanguage); // ✅ Save language persistently
        addMessage("RAI", languageConfirmations[userLanguage], "ai");
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user");
        userInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Show Typing Bubble
        const typingBubble = addTypingBubble();
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Always fetch the latest selected language
        userLanguage = localStorage.getItem("selectedLanguage") || "English";

        console.log("🛠️ Debug: Sending message in language:", userLanguage);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, language: userLanguage }) // ✅ Send latest language
            });

            const data = await response.json();
            removeTypingBubble(typingBubble);

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
