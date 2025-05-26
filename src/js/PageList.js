import { RAWG_API_KEY } from "../config.js";

export function PageList(searchQuery = "") {
  console.log("PageList", searchQuery);
  const container = document.getElementById("pageContent");

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

  let page = 1;
  const pageSize = 9;
  let totalLoaded = 0;

  const grid = document.getElementById("gamesGrid");
  const showMoreBtn = document.getElementById("showMoreBtn");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const platformFilter = document.getElementById("platformFilter");

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
        if (page === 1) {
          totalLoaded = 0;
          grid.innerHTML = "";
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
          col.querySelector(".card-game").addEventListener("click", () => {
            window.location.hash = `#pagedetail/${game.id}`;
          });
          grid.append(col);
        });

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

  fetchAndRender();

  searchBtn.addEventListener("click", () => {
    const q = searchInput.value.trim();
    window.location.hash = `#pagelist/${encodeURIComponent(q)}`;
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = e.target.value.trim();
      window.location.hash = `#pagelist/${encodeURIComponent(q)}`;
    }
  });

  platformFilter.addEventListener("change", (e) => {
    console.log("Filtrer plateforme", e.target.value);
  });

  showMoreBtn.addEventListener("click", () => {
    page++;
    fetchAndRender();
  });
}
