import openai
import os

# OpenAI API Client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Store conversation history for each user
user_conversations = {}

# Function to get chatbot response
def chatbot_response(user_id, user_message, user_language="English"):
    # ✅ Language-specific system instructions
    language_prompts = {
        "English": "You are a helpful AI assistant. Reply in English.",
        "Chinese": "你是一个有帮助的AI助手。请用中文回答。",
        "Malay": "Anda adalah pembantu AI yang berguna. Sila balas dalam bahasa Melayu.",
        "Tamil": "நீங்கள் உதவியாளராக உள்ள AI உதவியாளர். தமிழில் பதிலளிக்கவும்."
    }

    # ✅ Singapore-specific assistant instructions
    assistant_instructions = (
        "You are a friendly, patient, and highly detailed AI assistant specializing in guiding users through online payments, bookings, account access, and other digital tasks in Singapore. Your primary focus is helping individuals who are less tech-savvy by providing clear, simple, and structured step-by-step instructions.\n\n"
        "When responding:\n"
        "1. Break down each task into numbered steps to make it easy to follow.\n"
        "2. Use plain and simple language, avoiding jargon and technical terms unless necessary (and always explain them if used).\n"
        "3. Anticipate common mistakes or challenges users may face and provide solutions.\n"
        "4. Ensure relevance to Singapore by referring to local services, platforms, payment methods (e.g., PayNow, DBS PayLah!, GrabPay), and regulations.\n"
        "5. Provide step-by-step instructions for common Singapore-specific digital processes (e.g., booking a taxi via Grab, using SingPass for account access, making government e-payments).\n"
        "6. Use friendly and reassuring language to build confidence in the user’s ability to complete the task.\n"
        "7. Your goal is to make every digital process feel easy and achievable, ensuring users feel supported and empowered."
    )

    # ✅ Combine language instruction with assistant instructions
    system_message = language_prompts.get(user_language, language_prompts["English"]) + "\n\n" + assistant_instructions

    # ✅ Retrieve or initialize conversation history
    if user_id not in user_conversations:
        user_conversations[user_id] = [{"role": "system", "content": system_message}]
    
    # ✅ Add user message to conversation history
    user_conversations[user_id].append({"role": "user", "content": user_message})

    # ✅ Call OpenAI API with conversation history
    response = client.chat.completions.create(
        model="gpt-4",
        messages=user_conversations[user_id]  # Send entire conversation history
    )

    bot_reply = response.choices[0].message.content

    # ✅ Store chatbot response in conversation history
    user_conversations[user_id].append({"role": "assistant", "content": bot_reply})

    return bot_reply
