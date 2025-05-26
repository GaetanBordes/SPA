import { RAWG_API_KEY } from "../config.js";

export function Home() {
  console.log("Home");
  const container = document.getElementById("pageContent");

  container.innerHTML = `
    <div class="container my-4">

      <!-- Hero Banner -->
      <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5 text-center">
          <h1 class="display-5 fw-bold">À venir en 2030</h1>
          <p class="col-md-8 fs-4 mx-auto">
            Découvrez les jeux les plus attendus de l'année prochaine.
          </p>
        </div>
      </div>

      <!-- Spinner de chargement -->
      <div id="homeSpinner" class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement…</span>
        </div>
      </div>

      <!-- Grille de jeux -->
      <div id="homeList" class="row g-3"></div>

      <!-- Show more -->
      <div class="text-center mt-4">
        <button class="btn btn-outline-secondary" id="showMoreHome">Show more</button>
      </div>
    </div>
  `;

  const spinner = document.getElementById("homeSpinner");
  const grid = document.getElementById("homeList");
  const btn = document.getElementById("showMoreHome");

  let page = 1;
  const pageSize = 9;
  let totalLoaded = 0;

  const fetchAndRenderHome = () => {
    spinner.style.display = "flex";

    const today = new Date().toISOString().slice(0, 10);
    const nextYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    )
      .toISOString()
      .slice(0, 10);

    const url =
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}` +
      `&dates=${today},${nextYear}` +
      `&ordering=-added` +
      `&page=${page}&page_size=${pageSize}`;

    fetch(url)
      .then((res) => {
        spinner.style.display = "none";
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        if (page === 1) {
          grid.innerHTML = "";
          totalLoaded = 0;
          btn.style.display = "inline-block";
        }

        totalLoaded += data.results.length;

        data.results.forEach((game) => {
          const col = document.createElement("div");
          col.className = "col-sm-6 col-md-4";
          col.innerHTML = `
            <div class="card card-game h-100">
              <img
                src="${game.background_image}"
                class="game-img card-img-top"
                alt="${game.name}"
              >
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${game.name}</h5>
                <p class="card-text text-muted mb-4">
                  Sortie : ${game.released || "N/A"}
                </p>
                <a href="#pagedetail/${
                  game.id
                }" class="mt-auto btn btn-primary">
                  Voir détails
                </a>
              </div>
            </div>
          `;
          grid.append(col);
        });

        if (totalLoaded >= pageSize * 3) {
          btn.style.display = "none";
        }
      })
      .catch((err) => {
        console.error("Fetch Home erreur :", err);
        grid.innerHTML = '<p class="text-danger">Erreur de chargement.</p>';
      });
  };

  fetchAndRenderHome();

  btn.addEventListener("click", () => {
    page++;
    fetchAndRenderHome();
  });
}
