import openai
import os
from flask import Flask, request, jsonify, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/")
def home():
    return render_template("index.html")  # ✅ Serve the chatbot UI

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True, silent=True)
        print("Received data:", data)

        if not data or "message" not in data:
            return jsonify({"reply": "Invalid request. Please send a JSON message."}), 400
        
        user_message = data["message"]
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI chatbot."},
                {"role": "user", "content": user_message}
            ]
        )
        return jsonify({"reply": response.choices[0].message.content})

    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "An error occurred processing your request."}), 500

if __name__ == "__main__":
    app.run(debug=True)
