#!/usr/bin/env bash
set -e

echo "🌱 Finca BIO MASSA – Projektstruktur wird aufgebaut ..."

# === Frontend für GitHub Pages ===
mkdir -p docs
cat > docs/index.html <<'HTML'
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>🌱 Finca BIO MASSA – Bauernregistrierung</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>🌱 Bauernregistrierung</h1>
  <form id="farmerForm">
    <input type="text" id="name" placeholder="Name" required>
    <input type="text" id="phone" placeholder="Telefon" required>
    <button type="submit">➕ Hinzufügen</button>
  </form>
  <h2>📋 Registrierte Bauern</h2>
  <ul id="farmerList"></ul>
  <script src="app.js"></script>
</body>
</html>
HTML

cat > docs/style.css <<'CSS'
body { font-family: Arial, sans-serif; margin: 20px; }
h1 { color: #2a7a2a; }
form input { margin: 5px; padding: 6px; }
button { padding: 6px 10px; background: #2a7a2a; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
li { margin: 5px 0; }
CSS

cat > docs/app.js <<'JS'
const API_URL = "https://finca-bio-massa.onrender.com/api/farmers";

document.getElementById("farmerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone })
  });

  document.getElementById("farmerForm").reset();
  loadFarmers();
});

async function loadFarmers() {
  const res = await fetch(API_URL);
  const farmers = await res.json();

  const list = document.getElementById("farmerList");
  list.innerHTML = "";
  farmers.forEach(f => {
    const li = document.createElement("li");
    li.textContent = `${f.name} – ${f.phone}`;
    list.appendChild(li);
  });
}
loadFarmers();
JS

echo "✅ Frontend in docs/ erstellt (GitHub Pages ready)."

# === Backend für Render ===
mkdir -p backend
cat > backend/app.py <<'PY'
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
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
PY

cat > backend/requirements.txt <<'REQ'
flask
flask-cors
gunicorn
REQ

echo "web: gunicorn app:app" > backend/Procfile

echo "✅ Backend in backend/ erstellt (Render/Heroku ready)."

# === Git vorbereiten ===
git add docs backend
git commit -m "Setup: Frontend (docs) + Backend (Render-ready)"
git push origin main

echo "🚀 Projekt fertig! 
➡️ Frontend: GitHub Pages (docs/) 
➡️ Backend: Deploy auf Render mit backend/ "
