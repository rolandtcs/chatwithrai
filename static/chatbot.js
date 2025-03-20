document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");
    const changeLangBtn = document.getElementById("change-lang-btn");

    // ✅ Load stored language or default to English
    let userLanguage = localStorage.getItem("selectedLanguage") || "English";
    changeLangBtn.value = userLanguage; // ✅ Ensure dropdown reflects stored language on load

    // ✅ List of FAQs
    const faqList = [
        { text: "💰 How to make a PayNow transfer?", question: "How to make a PayNow transfer?" },
        { text: "🚖 How to book a Grab ride?", question: "How to book a Grab ride?" },
        { text: "🧾 How to pay bills online?", question: "How to pay bills online?" },
        { text: "🔑 How to access SingPass?", question: "How to access SingPass?" },
        { text: "🚉 How to top up an EZ-Link card?", question: "How to top up an EZ-Link card?" }
    ];

    // ✅ Initial message with clickable FAQs
    async function initiateConversation() {
        let faqButtons = faqList.map(faq => 
            `<button class="faq-btn" data-question="${faq.question}">${faq.text}</button>`
        ).join("<br>");

        const initialMessage = `
            <p>Hello, I'm RAI! 😊 How can I assist you today?</p>
            <br>
            <p>Here are some common things I can help with:</p>
            ${faqButtons}
            <br>
            <p>Just click on a question, or type in your own question, and I'll guide you step by step! 😊</p>
        `;

        addMessage("RAI", initialMessage, "ai");
        attachFAQClickHandlers();
    }

    // ✅ Attach event listeners to FAQ buttons
    function attachFAQClickHandlers() {
        document.querySelectorAll(".faq-btn").forEach(button => {
            button.addEventListener("click", function () {
                userInput.value = this.dataset.question;
                sendMessage();
            });
        });
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

    // ✅ Send user message
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

    // ✅ Function to add messages to chat
    function addMessage(sender, text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.innerHTML = `<strong>${sender}:</strong><br>${text}`;
        
        // ✅ Convert Markdown to HTML using a Markdown library (e.g., marked.js)
        messageDiv.innerHTML = marked.parse(text);
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // ✅ Function to add a typing indicator
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

    // ✅ Function to remove typing indicator
    function removeTypingBubble(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }
    }

    // ✅ Handle Enter key for sending messages
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);

    initiateConversation(); // ✅ Start chat
});
