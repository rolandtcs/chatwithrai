import openai
import os
import time

# OpenAI API Client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Global conversation history (shared across all languages)
conversation_history = []
last_message_time = time.time()  # ✅ Track last user input time

# Function to check inactivity and reset conversation if needed
def check_inactivity():
    global conversation_history, last_message_time
    current_time = time.time()
    inactive_duration = current_time - last_message_time  # ✅ Time since last user input

    if inactive_duration > 600:  # ✅ 10 minutes (600 seconds) timeout
        conversation_history = []  # ✅ Clear history
        last_message_time = current_time  # ✅ Reset timer
        return "Your session has been reset due to inactivity. Let's start fresh!"
    return None

# Function to get chatbot response
def chatbot_response(user_message, user_language="English"):
    global conversation_history, last_message_time  # Ensure we use the same history

    # ✅ Check if the user was inactive
    inactivity_message = check_inactivity()
    if inactivity_message:
        return inactivity_message  # ✅ Inform user of session reset

    # ✅ Update the last message time
    last_message_time = time.time()

    # ✅ Language-specific system instructions
    language_prompts = {
        "English": "You are a helpful AI assistant. Reply in English.",
        "Chinese": "你是一个有帮助的AI助手。请用中文回答。",
        "Malay": "Anda adalah pembantu AI yang berguna. Sila balas dalam bahasa Melayu.",
        "Tamil": "நீங்கள் உதவியாளராக உள்ள AI உதவியாளர். தமிழில் பதிலளிக்கவும்."
    }

    # ✅ Singapore-specific assistant instructions
    assistant_instructions = (
        "You are a friendly, patient, and highly detailed AI assistant specializing in guiding users through online payments, bookings, account access, and other digital tasks in Singapore. "
        "Your primary focus is helping individuals who are less tech-savvy by providing clear, simple, and structured step-by-step instructions.\n\n"
        "When responding:\n"
        "1. Break down each task into numbered steps to make it easy to follow.\n"
        "2. Use plain and simple language, avoiding jargon and technical terms unless necessary (and always explain them if used).\n"
        "3. Anticipate common mistakes or challenges users may face and provide solutions.\n"
        "4. Ensure relevance to Singapore by referring to local services, platforms, payment methods (e.g., PayNow, DBS PayLah!, GrabPay), and regulations.\n"
        "5. Provide step-by-step instructions for common Singapore-specific digital processes (e.g., booking a taxi via Grab, using SingPass for account access, making government e-payments).\n"
        "6. Use friendly and reassuring language to build confidence in the user’s ability to complete the task.\n"
        "7. Your goal is to make every digital process feel easy and achievable, ensuring users feel supported and empowered."
    )

    # ✅ Always update the system message with the latest selected language
    system_message = {
        "role": "system",
        "content": language_prompts.get(user_language, language_prompts["English"]) + "\n\n" + assistant_instructions
    }

    # ✅ Ensure system message is at the start of history
    if not conversation_history or conversation_history[0]["role"] != "system":
        conversation_history.insert(0, system_message)
    else:
        conversation_history[0] = system_message  # ✅ Update system message dynamically when language changes

    # ✅ Add user message to conversation history
    conversation_history.append({"role": "user", "content": user_message})

    # ✅ Debugging: Print the selected language
    print(f"🛠️ Debug: Chatbot responding in {user_language}")

    # ✅ Trim history to the last 50 messages (excluding the system message)
    if len(conversation_history) > 51:  # System message + 50 messages
        conversation_history = [conversation_history[0]] + conversation_history[-50:]

    # ✅ Send entire conversation history to OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=conversation_history
    )

    bot_reply = response.choices[0].message.content

    # ✅ Add chatbot response to conversation history
    conversation_history.append({"role": "assistant", "content": bot_reply})

    return bot_reply
