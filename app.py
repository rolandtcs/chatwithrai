from flask import Flask, request, jsonify, render_template
from chatbot import chatbot_response  # ✅ Import chatbot function

app = Flask(__name__, static_folder="static", template_folder="templates")

# ✅ Serve Chatbot UI
@app.route("/")
def home():
    return render_template("index.html")

# ✅ Chat API
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True, silent=True)
        
        if not data or "message" not in data:
            return jsonify({"reply": "Invalid request. Please send a JSON message with 'message'."}), 400

        user_message = data["message"]
        user_language = data.get("language", "English")  # ✅ Default to English if no language is provided

        bot_reply = chatbot_response(user_message, user_language)  # ✅ Pass language to chatbot.py

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "Sorry, an error occurred!"}), 500

if __name__ == "__main__":
    app.run(debug=True)
