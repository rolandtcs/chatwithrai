document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box"); // Match the ID with the one in HTML
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");

    // Function to initiate the conversation
    async function initiateConversation() {
        const initialMessage = "Hello there! I am RAI, how may I assist you?";

        // Add AI's initial message
        addMessage("RAI", initialMessage, "ai");

        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Add user message
        addMessage("You", userMessage, "user");
        userInput.value = ''; // Clear input

        // Scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;

        // Send to backend
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        // Add AI response
        addMessage("RAI", data.response || "Sorry, something went wrong!", "ai");

        // Scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addMessage(sender, text, type) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", type);
        messageDiv.innerHTML = `<strong>${sender}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chatBox.appendChild(messageDiv);

        // Auto-scroll after adding message
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Enter key to send message
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent new line in textarea
            sendMessage();
        }
    });

    // Button click to send message
    sendButton.addEventListener("click", sendMessage);

    // Initiate the conversation when the page loads
    initiateConversation();
});
