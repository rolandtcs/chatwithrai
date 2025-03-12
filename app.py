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
        print("Received data:", data)  # ✅ Debugging: Log received data

        if not data or "message" not in data:
            print("Error: Invalid JSON format received")  # ✅ Log JSON error
            return jsonify({"reply": "Invalid request. Please send a JSON message."}), 400

        user_message = data["message"]

        # ✅ Debugging: Log before calling OpenAI API
        print("Sending request to OpenAI:", user_message)

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI chatbot."},
                {"role": "user", "content": user_message}
            ]
        )

        # ✅ Debugging: Log the full OpenAI response
        print("OpenAI response:", response)

        return jsonify({"reply": response.choices[0].message.content})

    except Exception as e:
        print("Error:", e)  # ✅ Log the error for debugging
        return jsonify({"reply": "Sorry, there was an error processing your request."})

if __name__ == "__main__":
    app.run(debug=True)
