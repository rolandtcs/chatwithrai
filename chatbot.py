import openai
import os

# OpenAI API Client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Function to get chatbot response
def chatbot_response(user_message, user_language):
    # ✅ Language-specific system instructions
    language_prompts = {
        "English": "You are a helpful AI assistant. Reply in English.",
        "Chinese": "你是一个有帮助的AI助手。请用中文回答。",
        "Malay": "Anda adalah pembantu AI yang berguna. Sila balas dalam bahasa Melayu.",
        "Tamil": "நீங்கள் உதவியாளராக உள்ள AI உதவியாளர். தமிழில் பதிலளிக்கவும்."
    }

    # ✅ Core assistant instructions
    assistant_instructions = (
        "You are a friendly, patient, and highly detailed AI assistant specializing in guiding users through online payments, "
        "bookings, account access, and other digital tasks. Your primary focus is helping individuals who are less tech-savvy "
        "by providing clear, simple, and structured step-by-step instructions.
        "When responding:\n"
        "1. Break down each task into numbered steps to make it easy to follow.\n"
        "2. Use plain and simple language, avoiding jargon and technical terms unless necessary (and always explain them if used).\n"
        "3. Anticipate common mistakes or challenges users may face and provide solutions.\n"
        "4. Ensure relevance to Singapore by referring to local services, platforms, payment methods, and regulations.\n"
        "5. Use friendly and reassuring language to build confidence in the user’s ability to complete the task.\n"
        "6. Your goal is to make every digital process feel easy and achievable, ensuring users feel supported and empowered."
    )

    # ✅ Combine general assistant prompt with language-specific instruction
    system_message = language_prompts.get(user_language, language_prompts["English"]) + "\n\n" + assistant_instructions

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_message},  # ✅ Ensure responses are in selected language
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content
