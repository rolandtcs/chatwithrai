document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    let userLanguage = "English"; // Default language

    // ✅ Function to start conversation with optional language selection
    async function initiateConversation() {
        const initialMessage =
            "Hello! I'm RAI! How can I assist you today?\n" +
            "To change languageat any time, enter:\n" +
            "1️⃣ English\n2️⃣ 中文\n3️⃣ Melayu\n4️⃣ தமிழ் (Optional, English is default)";
        addMessage("RAI", initialMessage, "ai");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user");
        userInput.value = ''; // Clear input field
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Show Typing Bubble
        const typingBubble = addTypingBubble();
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Detect language choice (Optional)
        if (["1", "English", "english"].includes(userMessage.trim())) {
            userLanguage = "English";
            removeTypingBubble(typingBubble);
            addMessage("RAI", "Got it! I'll assist you in English. How may I help you?", "ai");
            return;
        } 
        if (["2", "中文", "chinese", "mandarin"].includes(userMessage.trim())) {
            userLanguage = "Chinese";
            removeTypingBubble(typingBubble);
            addMessage("RAI", "很好！我会用中文帮助您。请问有什么需要？", "ai");
            return;
        } 
        if (["3", "Melayu", "malay"].includes(userMessage.trim())) {
            userLanguage = "Malay";
            removeTypingBubble(typingBubble);
            addMessage("RAI", "Bagus! Saya akan membantu anda dalam bahasa Melayu. Apa yang boleh saya bantu?", "ai");
            return;
        } 
        if (["4", "தமிழ்", "tamil"].includes(userMessage.trim())) {
            userLanguage = "Tamil";
            removeTypingBubble(typingBubble);
            addMessage("RAI", "நன்று! நான் தமிழ் மூலம் உங்களை உதவுவேன். எப்படி உதவலாம்?", "ai");
            return;
        } 

        // ✅ Send user message to backend (Default: English)
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, language: userLanguage }) 
            });

            const data = await response.json();
            console.log("Received response from API:", data);

            removeTypingBubble(typingBubble); 

            if (data.reply) {
                addMessage("RAI", data.reply, "ai");
            } else {
                console.error("Error: Unexpected API response format", data);
                addMessage("RAI", "Sorry, something went wrong!", "ai");
            }
        } catch (error) {
            console.error("Error sending message:", error);
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

    // ✅ Typing Bubble Effect (WhatsApp Style)
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

    // ✅ Remove Typing Bubble
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

    initiateConversation(); // ✅ Start chat with optional language selection
});
