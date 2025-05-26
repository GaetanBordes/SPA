// js/Home.js

const Home = () => {
  console.log("Home");
  const container = document.getElementById("pageContent");

  // 1) On injecte un hero + spinner + grille + bouton
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

  let page = 1;
  const pageSize = 9;
  let totalLoaded = 0;

  const fetchAndRenderHome = () => {
    const spinner = document.getElementById("homeSpinner");
    spinner.style.display = "flex";

    // Remplace dates par la période qui t’intéresse
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
        totalLoaded += data.results.length;
        const grid = document.getElementById("homeList");

        data.results.forEach((game) => {
          const col = document.createElement("div");
          col.className = "col-sm-6 col-md-4";

          col.innerHTML = `
            <div class="card card-game h-100">
              <img src="${game.background_image}" 
                   class="game-img card-img-top" 
                   alt="${game.name}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${game.name}</h5>
                <p class="card-text text-muted mb-4">
                  Sortie : ${game.released || "N/A"}
                </p>
                <a href="#pagedetail/${game.id}" 
                   class="mt-auto btn btn-primary">
                  Voir détails
                </a>
              </div>
            </div>
          `;
          grid.append(col);
        });

        if (totalLoaded >= pageSize * 3) {
          document.getElementById("showMoreHome").style.display = "none";
        }
      })
      .catch((err) => {
        console.error("Fetch Home erreur :", err);
        document.getElementById("homeList").innerHTML =
          '<p class="text-danger">Erreur de chargement.</p>';
      });
  };

  // Initial
  fetchAndRenderHome();

  // Show more
  document.getElementById("showMoreHome").addEventListener("click", () => {
    page++;
    fetchAndRenderHome();
  });
};
