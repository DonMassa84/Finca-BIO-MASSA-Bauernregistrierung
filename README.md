# 🌱 Finca BIO MASSA – Bauernregistrierung

🇩🇪 Digitale Anwendung zur Registrierung von Kakaobauern für das Projekt **Finca BIO MASSA**.  
Mitgliederverwaltung, Foto-Upload, Produktionsdaten und CSV-Export.  
Entwickelt für Transparenz, Finanzierungsberichte und nachhaltige Wertschöpfungsketten in Kamerun.  

---

🇫🇷 Application numérique pour l’enregistrement des cacaoculteurs du projet **Finca BIO MASSA**.  
Gestion des membres, photos, données de production et export CSV.  
Conçue pour la transparence, les rapports financiers et des chaînes de valeur durables au Cameroun.  

---

## 🚀 Features
- Bauern-/Mitgliederregistrierung mit Formular  
- Foto-Upload und Dokumentation  
- Produktionsdaten (kg/Monat)  
- Suchfunktion und Mitgliederliste  
- CSV-Export für Finanzberichte  
- Einfache Authentifizierung (optional per Passwort)  

---

## ⚙️ Installation (lokal)

```bash
git clone https://github.com/DonMassa84/Finca-BIO-MASSA-Bauernregistrierung.git
cd Finca-BIO-MASSA-Bauernregistrierung
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export APP_SECRET_KEY=change-me
python app.py

