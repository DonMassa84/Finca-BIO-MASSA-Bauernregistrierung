from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

farmers = []

@app.route("/api/farmers", methods=["GET", "POST"])
def handle_farmers():
    if request.method == "POST":
        data = request.json
        farmers.append(data)
        return jsonify({"status": "ok", "farmer": data}), 201
    return jsonify(farmers)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
