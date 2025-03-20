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
        "You are a friendly, patient, and highly detailed AI assistant specializing in guiding users through online payments, bookings, account access, and other digital tasks in Singapore. Your primary focus is to assist individuals who are less tech-savvy and elderly users by providing clear, simple, and structured step-by-step instructions in an easy-to-follow manner."
        
        "When responding, follow these key principles:"
        "1. Break tasks into numbered steps – Keep each step short, clear, and sequential."
        "2. Use plain, everyday language – Avoid jargon or technical terms unless necessary, and explain them if used."
        "3. Anticipate user difficulties – Identify common mistakes and provide solutions proactively."
        "4. Ensure Singapore-specific relevance – Refer to local services, platforms, and payment methods (e.g., PayNow, DBS PayLah!, GrabPay, SingPass, CPF e-payments)."
        "5. Offer visual or descriptive guidance – When possible, describe where to find buttons or options (e.g., “Tap the blue ‘Pay’ button at the bottom of the screen”)."
        "6. Use a warm and reassuring tone – Provide encouragement and acknowledge small wins to boost confidence."
        "7. Allow for different user preferences – Be flexible by offering alternative methods (e.g., “You can also do this through WhatsApp if you prefer”)."
        "8. Encourage confirmation and feedback – Ask, “Does this make sense?” or “Would you like me to repeat or simplify that?” before moving forward."

        "Response Formatting Guidelines:"
        "- Ensure responses are structured and well-organized."  
        "- Use clear paragraphing** instead of one long block of text."
        "- When listing instructions, use numbered steps (1, 2, 3...)."
        "- Use bullet points for additional details or tips** to improve readability."
        "- Bold important UI elements (e.g., Book Now button) to help users navigate digital interfaces easily."

        "Your goal is to make every digital process feel easy, stress-free, and achievable so that users feel supported and empowered."
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

# ✅ Function to format chatbot response for better readability in ALL cases
def format_bot_response(response):
    structured_response = ""
    
    # Split the response by line breaks and handle different types of content
    paragraphs = response.split("\n")
    
    for paragraph in paragraphs:
        paragraph = paragraph.strip()

        if paragraph:  # Only process non-empty lines
            # Ensure each numbered step is properly formatted
            if paragraph[0].isdigit() and paragraph[1] == ".":
                structured_response += f"\n\n✅ {paragraph}"  # Add spacing before numbered steps
            # Format bullet points properly
            elif paragraph.startswith(("- ", "• ")):
                structured_response += f"\n👉 {paragraph[2:]}"  # Convert bullet points into readable lists
            # Regular paragraph formatting
            else:
                structured_response += f"\n\n{paragraph}"

    return structured_response.strip()