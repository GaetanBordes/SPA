// PageList: listing, recherche, filtre plateforme, et "show more"
const PageList = (searchQuery = "") => {
  console.log("PageList", searchQuery);
  const container = document.getElementById("pageContent");

  // 1. On injecte le header de recherche + filtre + grid + bouton
  container.innerHTML = `
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
            <!-- options dynamiques -->
          </select>
        </div>
      </div>

      <div id="gamesGrid" class="row g-3"></div>

      <div class="text-center mt-4">
        <button class="btn btn-outline-secondary" id="showMoreBtn">Show more</button>
      </div>
    </div>
  `;

  let page = 1;
  const pageSize = 9;
  let totalLoaded = 0;

  // 2. Fonction qui va fetch et rendre les cards
  const fetchAndRender = () => {
    const url =
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}` +
      `&search=${encodeURIComponent(searchQuery)}` +
      `&page=${page}&page_size=${pageSize}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        totalLoaded += data.results.length;
        const grid = document.getElementById("gamesGrid");

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

          col.querySelector(".card-game").addEventListener("click", () => {
            window.location.hash = `#pagedetail/${game.id}`;
          });

          grid.append(col);
        });

        // Masquer le bouton après 27 items
        if (totalLoaded >= pageSize * 3) {
          document.getElementById("showMoreBtn").style.display = "none";
        }
      })
      .catch((err) => {
        console.error("Fetch RAWG erreur :", err);
        container.innerHTML = "<p>Erreur de chargement des jeux.</p>";
      });
  };

  // 3. Premier appel
  fetchAndRender();

  // 4. Gestion de la recherche
  document.getElementById("searchBtn").addEventListener("click", () => {
    const q = document.getElementById("searchInput").value.trim();
    window.location.hash = `#pagelist/${encodeURIComponent(q)}`;
  });
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      window.location.hash = `#pagelist/${encodeURIComponent(q)}`;
    }
  });

  // 5. Gestion du filtre plateforme (à implémenter)
  document.getElementById("platformFilter").addEventListener("change", (e) => {
    console.log("Filtrer plateforme", e.target.value);
    // TODO : relancer fetch avec &platforms=ID
  });

  // 6. Bouton "Show more"
  document.getElementById("showMoreBtn").addEventListener("click", () => {
    page++;
    fetchAndRender();
  });
};
