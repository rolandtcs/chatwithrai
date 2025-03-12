import openai
import os  # Import OS to use environment variables

# Load OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define OpenAI client properly
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Function to generate chatbot response
def chatbot_response(user_message):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful AI chatbot that assists with online payments, bookings, and account access."},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content  # Extract response text

# Loop for chatbot interaction in terminal
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        print("Chatbot: Goodbye!")
        break
    response = chatbot_response(user_input)
    print("Chatbot:", response)
