import { RAWG_API_KEY } from "../config.js";

export function PageDetail(slug = "") {
  console.log("PageDetail slug:", slug);
  const container = document.getElementById("pageContent");

  container.innerHTML = `
    <div class="container my-4">
      <button id="backBtn" class="btn btn-link mb-3">← Retour</button>
      <div id="detail" class="row gy-4"></div>
    </div>
  `;
  document
    .getElementById("backBtn")
    .addEventListener("click", () => window.history.back());

  const url = `https://api.rawg.io/api/games/${slug}?key=${RAWG_API_KEY}`;
  console.log("→ Fetching detail from", url);

  fetch(url)
    .then((res) => {
      console.log("← Detail status:", res.status);
      if (res.status === 404) {
        // Jeu non trouvé
        throw new Error("404");
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((game) => {
      const d = document.getElementById("detail");
      d.innerHTML = `
        <div class="col-12 col-md-5">
          <img
            src="${game.background_image}"
            alt="${game.name}"
            class="img-fluid rounded"
          />
        </div>
        <div class="col-12 col-md-7">
          <h2>${game.name}</h2>
          <p>${game.description_raw || ""}</p>
          <!-- …le reste de ton HTML… -->
        </div>
      `;
    })
    .catch((err) => {
      console.error("Fetch détail erreur :", err);
      const d = document.getElementById("detail");
      if (err.message === "404") {
        d.innerHTML = `
          <div class="col-12 text-center">
            <h3>Jeu introuvable</h3>
            <p>Le jeu demandé n'existe pas ou n'est pas disponible.</p>
          </div>
        `;
      } else {
        d.innerHTML = `
          <div class="col-12 text-center">
            <h3>Erreur de chargement</h3>
            <p>Une erreur est survenue (${err.message}).</p>
          </div>
        `;
      }
    });
}
