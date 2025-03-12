import openai
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

# ✅ Define OpenAI client properly
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chatbot_response(user_message):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful AI chatbot that assists with online payments, bookings, and account access."},
            {"role": "user", "content": user_message}
        ]
    )
    return response.choices[0].message.content  # ✅ Correct way to get the response

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"reply": "Please type a message."})

    try:
        bot_reply = chatbot_response(user_message)
        return jsonify({"reply": bot_reply})
    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "Sorry, there was an error processing your request."})

if __name__ == "__main__":
    app.run(debug=True)
