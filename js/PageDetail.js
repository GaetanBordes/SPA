// PageDetail : fiche complète d’un jeu
const PageDetail = (gameId = "") => {
  console.log("PageDetail", gameId);
  const container = document.getElementById("pageContent");
  d.innerHTML = `
  <div class="col-12 col-md-5">
    <img src="${game.background_image}" alt="${game.name}"
         class="game-detail-img">
  </div>
  …
`;

  document
    .getElementById("backBtn")
    .addEventListener("click", () => window.history.back());

  fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`)
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((game) => {
      const d = document.getElementById("detail");
      d.innerHTML = `
        <h2>${game.name}</h2>
        <img src="${game.background_image}" alt="${game.name}">
        <p>${game.description_raw || ""}</p>
        <ul>
          ${game.released ? `<li>Date de sortie : ${game.released}</li>` : ""}
          ${
            game.developers.length
              ? `<li>Développeur(s) : ${game.developers
                  .map(
                    (dev) => `<a href="#pagelist/${dev.name}">${dev.name}</a>`
                  )
                  .join(", ")}</li>`
              : ""
          }
          ${
            game.publishers.length
              ? `<li>Éditeur(s) : ${game.publishers
                  .map(
                    (pub) => `<a href="#pagelist/${pub.name}">${pub.name}</a>`
                  )
                  .join(", ")}</li>`
              : ""
          }
          ${
            game.genres.length
              ? `<li>Genres : ${game.genres
                  .map((g) => `<a href="#pagelist/${g.name}">${g.name}</a>`)
                  .join(", ")}</li>`
              : ""
          }
          ${
            game.platforms.length
              ? `<li>Plateformes : ${game.platforms
                  .map(
                    (p) =>
                      `<a href="#pagelist/${p.platform.name}">${p.platform.name}</a>`
                  )
                  .join(", ")}</li>`
              : ""
          }
          ${
            game.website
              ? `<li>Site Web : <a href="${game.website}" target="_blank">${game.website}</a></li>`
              : ""
          }
          <li>Note moyenne : ${game.rating} (${game.ratings_count} votes)</li>
        </ul>
        <div class="screenshots">
          ${game.short_screenshots
            .slice(0, 4)
            .map((s) => `<img src="${s.image}" alt="Screenshot">`)
            .join("")}
        </div>
        ${game.clip ? `<video controls src="${game.clip.clip}"></video>` : ""}
        <p><a href="${
          game.metacritic_url
        }" target="_blank">Acheter / voir plus d’infos</a></p>
      `;
    })
    .catch((err) => {
      console.error("Fetch détail erreur :", err);
      container.innerHTML = "<p>Erreur de chargement du détail.</p>";
    });
};
