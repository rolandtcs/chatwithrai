document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box"); // Match the ID with the one in HTML
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send");

    // Function to initiate the conversation
    async function initiateConversation() {
        const initialMessage = "Hello there! I am RAI, how may I assist you?";
        addMessage("RAI", initialMessage, "ai");
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage("You", userMessage, "user");
        userInput.value = ''; // Clear input field
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            console.log("Received response from API:", data); // ✅ Debugging

            // ✅ FIX: Correct key (data.reply instead of data.response)
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
            event.preventDefault(); // Prevent new line in textarea
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);

    initiateConversation();
});
