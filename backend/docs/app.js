const API_URL = "https://dein-projekt-name.up.railway.app/api/farmers";

document.getElementById("farmerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone })
  });

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
