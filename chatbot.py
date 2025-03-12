import openai
import os

# ✅ OpenAI API Client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Function to get chatbot response
def chatbot_response(user_message):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a friendly and patient AI assistant specializing in helping users with online payments, bookings, account access, and other digital tasks. Your focus is on assisting those who are less tech-savvy, providing step-by-step guidance in a clear and simple manner. You operate within a Singaporean context, ensuring that your responses are relevant to local services, platforms, and regulations."},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content
