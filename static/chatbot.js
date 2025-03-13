document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    const changeLangBtn = document.getElementById("change-lang-btn");

    let userLanguage = "English"; // Default language
    let conversationHistory = []; // ✅ Store conversation history

    // ✅ Initial message
    async function initiateConversation() {
        const initialMessage = "Hello! I'm RAI! How can I assist you today?";
        addMessage("RAI", initialMessage, "ai");
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

        // ✅ Append user message to conversation history
        conversationHistory.push({ role: "user", content: userMessage });

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    language: userLanguage
                }) // ✅ Send full conversation history
            });

            const data = await response.json();
            removeTypingBubble(typingBubble);

            if (data.reply) {
                addMessage("RAI", data.reply, "ai");

                // ✅ Append chatbot response to conversation history
                conversationHistory.push({ role: "assistant", content: data.reply });
            } else {
                addMessage("RAI", "Sorry, something went wrong!", "ai");
            }
        } catch (error) {
            removeTypingBubble(typingBubble);
            addMessage("RAI", "Sorry, something went wrong!", "ai");
        }
    }

   
