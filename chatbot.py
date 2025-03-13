import openai
import os

# OpenAI API Client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Function to get chatbot response
def chatbot_response(user_message, user_language="English", chat_history=None):
    if chat_history is None:
        chat_history = []  # Initialize if not provided

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
        "Your primary focus is helping individuals who are less tech-savvy by providing clear, simple, and structured step-by-step instructions."
    )

    # ✅ Add system message only at the start of the conversation
    if not chat_history:
        system_message = {
            "role": "system",
            "content": language_prompts.get(user_language, language_prompts["English"]) + "\n\n" + assistant_instructions
        }
        chat_history.append(system_message)

    # ✅ Ensure chatbot always replies in the selected language
    language_instruction = language_prompts.get(user_language, language_prompts["English"])
    chat_history.append({"role": "system", "content": language_instruction})

    # ✅ Add user message to conversation history
    chat_history.append({"role": "user", "content": user_message})

    # ✅ Send entire conversation history to OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=chat_history
    )

    bot_reply = response.choices[0].message.content

    # ✅ Add chatbot response to conversation history
    chat_history.append({"role": "assistant", "content": bot_reply})

    return bot_reply, chat_history  # Return both response and updated history
