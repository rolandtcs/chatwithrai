document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    const changeLangBtn = document.getElementById("change-lang-btn");

    let userLanguage = "English"; // Default language
    let conversationHistory = []; // ✅ Store conversation history

    // ✅ Move addMessage() above its first usage
    function addMessage(sender, text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.innerHTML = `<strong>${sender}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✅ Initial message function
    async function initiateConversation() {
        const initialMessage = "Hello! I'm RAI! How can I assist you today?";
        addMessage("RAI", initialMessage, "ai"); // ✅ Now this won't throw an error
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✅ Language confirmation messages
    const languageConfirmations = {
        "English": "Language changed to English. How may I assist you?",
        "Chinese": "语言已更改为中文。我可以如何帮助您？",
        "Malay": "Bahasa telah ditukar ke Melayu. Bagaimana saya boleh membantu anda?",
        "Tamil": "மொழி தமிழாக மாற்றப்பட்டது. நான் எப்படி உதவலாம்?"
    };

    // ✅ Change language when user selects from dropdown
    changeLangBtn.addEventListener("change", function () {
        userLanguage = changeLangBtn.value;
        addMessage("RAI", languageConfirmations[userLanguage], "ai");

        // ✅ Keep conversation history even when language is changed
        conversationHistory.push({ role: "system", content: `Language changed to ${userLanguage}` });
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user"); // ✅ Now this won't throw an error
        userInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Show Typing Bubble
        const typingBubble = addTypingBubble();
        chatBox.scrollTop = chatBox.scrollHeight;

        // ✅ Append user message to conversation history
        conversationHistory.push({ role: "user", content: userMessage });

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: conversationHistory,
                    language: userLanguage
                }) // ✅ Send full conversation history
            });

            const data = await response.json();
            removeTypingBubble(typingBubble);

            if (data.reply) {
                addMessage("RAI", data.reply, "ai");
                conversationHistory.push({ role: "assistant", content: data.reply });
            } else {
                addMessage("RAI", "Sorry, something went wrong!", "ai");
            }
        } catch (error) {
            removeTypingBubble(typingBubble);
            addMessage("RAI", "Sorry, something went wrong!", "ai");
        }
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
