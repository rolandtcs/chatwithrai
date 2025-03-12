from flask import Flask, render_template, request, jsonify
import openai
import os  # Import OS to use environment variables

# Load OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize Flask app
app = Flask(__name__)

# Define OpenAI client properly
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Chatbot function
def chatbot_response(user_message):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful AI chatbot that assists with online payments, bookings, and account access."},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content  # Extract response text

# Web route for chatbot page
@app.route("/")
def home():
    return render_template("index.html")

# API endpoint for chatbot messages
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    bot_reply = chatbot_response(user_message)
    return jsonify({"reply": bot_reply})

# Run Flask web server
if __name__ == "__main__":
    app.run(debug=True)
