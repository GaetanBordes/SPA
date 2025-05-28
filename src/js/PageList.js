// src/js/PageList.js
import { RAWG_API_KEY } from "../config.js";

export function PageList(searchQuery = "") {
  console.log("PageList", searchQuery);
  const container = document.getElementById("pageContent");
  const pageTitleHTML = `
    <div class="container">
      <div class="row mb-3 align-items-center">
        <div class="col-md-6">
          <div class="input-group">
            <input
              type="text"
              id="searchInput"
              class="form-control"
              placeholder="Rechercher un jeu…"
              value="${searchQuery}"
            />
            <button class="btn btn-primary" id="searchBtn">Rechercher</button>
          </div>
        </div>
        <div class="col-md-4">
          <select id="platformFilter" class="form-select">
            <option value="">Toutes plateformes</option>
            <!-- TODO : charger dynamiquement les plateformes -->
          </select>
        </div>
      </div>
      <div id="gamesGrid" class="row g-3"></div>
      <div class="text-center mt-4">
        <button class="btn btn-outline-secondary" id="showMoreBtn">Show more</button>
      </div>
    </div>
  `;
  container.innerHTML = pageTitleHTML;

  // Récupération des éléments après injection
  const grid = document.getElementById("gamesGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const platformFilter = document.getElementById("platformFilter");

  let page = 1;
  const pageSize = 9;
  let totalLoaded = 0;

  // Fonction de fetch et rendu
  const fetchAndRender = () => {
    const url =
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}` +
      `&search=${encodeURIComponent(searchQuery)}` +
      `&page=${page}&page_size=${pageSize}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Si on recharge au page 1, on reset la grille
        if (page === 1) {
          grid.innerHTML = "";
          totalLoaded = 0;
          showMoreBtn.style.display = "inline-block";
        }

        totalLoaded += data.results.length;

        data.results.forEach((game) => {
          const col = document.createElement("div");
          col.className = "col-sm-6 col-md-4";
          col.innerHTML = `
            <div class="card card-game h-100">
              <img
                src="${game.background_image}"
                alt="${game.name}"
                class="game-img card-img-top"
              >
              <div class="card-body">
                <h5 class="card-title">${game.name}</h5>
                <p class="card-text">
                  ${game.platforms.map((p) => p.platform.name).join(", ")}
                </p>
              </div>
            </div>
          `;
          // Au clic sur la card, on passe au slug du jeu
          col.querySelector(".card-game").addEventListener("click", () => {
            window.location.hash = `#game/${encodeURIComponent(game.slug)}`;
          });
          grid.append(col);
        });

        // Masquer le bouton après 3 pages (27 items)
        if (totalLoaded >= pageSize * 3) {
          showMoreBtn.style.display = "none";
        }
      })
      .catch((err) => {
        console.error("Fetch RAWG erreur :", err);
        container.innerHTML =
          '<p class="text-danger">Erreur de chargement des jeux.</p>';
      });
  };

  // Premier appel
  fetchAndRender();

  // Recherche (clic + Enter)
  const doSearch = () => {
    const q = searchInput.value.trim();
    window.location.hash = `#pagelist/${encodeURIComponent(q)}`;
  };
  searchBtn.addEventListener("click", doSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });

  // À implémenter : rechargement avec filtre plateforme
  platformFilter.addEventListener("change", (e) => {
    console.log("Filtrer plateforme", e.target.value);
    // TODO : adapter searchQuery + reset page = 1 + appel fetchAndRender()
  });

  // Show more
  showMoreBtn.addEventListener("click", () => {
    page++;
    fetchAndRender();
  });
}
