from flask import Flask, request, jsonify, render_template, session
from chatbot import chatbot_response  # ✅ Import chatbot function

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = "your_secret_key"  # ✅ Required for session storage

# ✅ Serve Chatbot UI
@app.route("/")
def home():
    session.clear()  # ✅ Clear session when user refreshes
    return render_template("index.html")

# ✅ Chat API
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True, silent=True)

        if not data or "messages" not in data:
            return jsonify({"reply": "Oops! I didn't understand that. Please try again."}), 400

        user_messages = data["messages"]
        if not user_messages or not isinstance(user_messages, list):
            return jsonify({"reply": "Oops! I didn't understand that. Please try again."}), 400

        user_message = user_messages[-1]["content"]  # ✅ Extract last user message
        user_language = data.get("language", session.get("user_language", "English"))  # ✅ Persist language

        # ✅ Retrieve conversation history from session (or start fresh)
        conversation_history = session.get("conversation_history", [])

        # ✅ Get chatbot response with updated history
        bot_reply, conversation_history = chatbot_response(user_message, user_language, conversation_history)

        # ✅ Save updated conversation history and language in session
        session["conversation_history"] = conversation_history
        session["user_language"] = user_language  # ✅ Persist selected language

        return jsonify({"reply": bot_reply})

    except Exception as e:
        print("Error:", e)
        return jsonify({"reply": "Sorry, an error occurred!"}), 500

if __name__ == "__main__":
    app.run(debug=True)
