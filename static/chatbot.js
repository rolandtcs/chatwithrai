document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    const changeLangBtn = document.getElementById("change-lang-btn");

    let userLanguage = localStorage.getItem("selectedLanguage") || "English"; // ✅ Store selected language persistently
    let conversationHistory = []; // ✅ Store conversation history

    // ✅ Initial message
    async function initiateConversation() {
        const initialMessage = "Hello! I'm RAI! How can I assist you today?";
        addMessage("RAI", initialMessage, "ai");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✅ Change language and persist it
    changeLangBtn.addEventListener("change", function () {
        userLanguage = changeLangBtn.value;
        localStorage.setItem("selectedLanguage", userLanguage);
        addMessage("RAI", `Language changed to ${userLanguage}. How may I assist you?`, "ai");
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user");
        userInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        const typingBubble = addTypingBubble();
        chatBox.scrollTop = chatBox.scrollHeight;

        conversationHistory.push({ role: "user", content: userMessage });

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: conversationHistory,
                    language: userLanguage 
                })
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

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    initiateConversation();
});
