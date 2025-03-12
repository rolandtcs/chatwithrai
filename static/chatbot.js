document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    let userLanguage = "English"; // Default language

    // ✅ Function to start conversation with language selection
    async function initiateConversation() {
        const initialMessage =
        "Hello! I'm RAI! How can I assist you today?\n" +
        "To change language, please enter:\n" +
        "1️⃣ English\n2️⃣ 中文\n3️⃣ Melayu\n4️⃣ தமிழ்";
        addMessage("RAI", initialMessage, "ai");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user");
        userInput.value = ''; // Clear input field
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Detect language choice
        if (!userLanguage || userLanguage === "English") {
            if (["1", "English", "english"].includes(userMessage.trim())) {
                userLanguage = "English";
                addMessage("RAI", "Great! I'll assist you in English. How may I help you?", "ai");
                return;
            } else if (["2", "中文", "chinese", "mandarin"].includes(userMessage.trim())) {
                userLanguage = "Chinese";
                addMessage("RAI", "很好！我会用中文帮助您。请问有什么需要？", "ai");
                return;
            } else if (["3", "Melayu", "malay"].includes(userMessage.trim())) {
                userLanguage = "Malay";
                addMessage("RAI", "Bagus! Saya akan membantu anda dalam bahasa Melayu. Apa yang boleh saya bantu?", "ai");
                return;
            } else if (["4", "தமிழ்", "tamil"].includes(userMessage.trim())) {
                userLanguage = "Tamil";
                addMessage("RAI", "நன்று! நான் தமிழ் மூலம் உங்களை உதவுவேன். எப்படி உதவலாம்?", "ai");
                return;
            } else {
                addMessage("RAI", "❌ Please select a valid option: 1️⃣ English, 2️⃣ 中文, 3️⃣ Melayu, 4️⃣ தமிழ்", "ai");
                return;
            }
        }

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, language: userLanguage }) // ✅ Send language preference to backend
            });

            const data = await response.json();
            console.log("Received response from API:", data);

            if (data.reply) {
                addMessage("RAI", data.reply, "ai");
            } else {
                console.error("Error: Unexpected API response format", data);
                addMessage("RAI", "Sorry, something went wrong!", "ai");
            }
        } catch (error) {
            console.error("Error sending message:", error);
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

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);

    initiateConversation(); // ✅ Start chat with language selection
});
