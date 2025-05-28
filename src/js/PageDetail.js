// src/js/PageDetail.js
import { RAWG_API_KEY } from "../config.js";

export function PageDetail(slug = "") {
  const container = document.getElementById("pageContent");
  container.innerHTML = `
    <div class="container my-5">
      <button id="backBtn" class="btn btn-link mb-4">← Retour</button>
      <div id="detail"></div>
    </div>
  `;
  document
    .getElementById("backBtn")
    .addEventListener("click", () => window.history.back());

  fetch(`https://api.rawg.io/api/games/${slug}?key=${RAWG_API_KEY}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((game) => {
      const d = document.getElementById("detail");
      let html = "";

      // 1) Bannière Titre + note/votes
      html += `
        <div class="detail-header mb-4">
          <h1 class="d-inline">${game.name}</h1>
          <span class="badge bg-warning text-dark ms-3 rating">
            ${game.rating.toFixed(2)} / 5
          </span>
          <small class="text-muted ms-1">(${game.ratings_count} votes)</small>
        </div>
      `;

      // 2) Image principale
      if (game.background_image) {
        html += `
          <section class="mb-4">
            <img
              src="${game.background_image}"
              alt="${game.name}"
              class="img-fluid rounded game-detail-img"
            >
          </section>
        `;
      }

      // 3) Plot & Description
      if (game.description_raw) {
        html += `
          <section class="mb-4">
            <h5>Plot</h5>
            <p>${game.description_raw}</p>
          </section>
        `;
      }

      // 4) Fiche info en grille
      const infoItems = [
        game.developers?.length && [
          "Développeur(s)",
          game.developers
            .map(
              (d) =>
                `<a href="#pagelist/${encodeURIComponent(
                  d.name
                )}" class="internal">${d.name}</a>`
            )
            .join(", "),
        ],
        game.released && ["Release Date", game.released],
        game.genres?.length && [
          "Genre",
          game.genres.map((g) => g.name).join(", "),
        ],
        game.tags?.length && ["Tags", game.tags.map((t) => t.name).join(", ")],
        game.platforms?.length && [
          "Platforms",
          game.platforms.map((p) => p.platform.name).join(", "),
        ],
        game.publishers?.length && [
          "Publisher",
          game.publishers.map((p) => p.name).join(", "),
        ],
        game.website && [
          "Website",
          `<a href="${game.website}" target="_blank">${
            new URL(game.website).hostname
          }</a>`,
        ],
      ].filter(Boolean);

      html += `<div class="row mb-4 info-grid">`;
      infoItems.forEach(([label, value]) => {
        html += `
          <div class="col-12 col-md-6 mb-3">
            <strong>${label}</strong><br>
            ${value}
          </div>
        `;
      });
      html += `</div>`;

      // 5) Boutons BUY
      if (game.stores?.length) {
        html += `<div class="mb-4 store-buttons">`;
        game.stores.forEach((s) => {
          html += `<a href="${s.url}" class="btn btn-primary me-2 mb-2">${s.store.name}</a>`;
        });
        html += `</div>`;
      }

      // 6) Screenshots
      if (game.short_screenshots?.length) {
        html += `
          <section class="mb-4">
            <h5>Screenshots</h5>
            <div class="row g-2 screenshot-grid">
              ${game.short_screenshots
                .slice(0, 4)
                .map(
                  (s) => `
                <div class="col-6 col-md-3">
                  <img src="${s.image}" alt="Screenshot" class="img-fluid rounded">
                </div>
              `
                )
                .join("")}
            </div>
          </section>
        `;
      }

      // 7) Embed Trailer
      if (game.clip?.clip) {
        html += `
          <section class="mb-4">
            <h5>Trailer</h5>
            <div class="ratio ratio-16x9 rounded">
              <video controls>
                <source src="${game.clip.clip}" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
          </section>
        `;
      }

      // 8) Similar Games
      html += `
        <section class="mb-5">
          <h5>Similar Games</h5>
          <div id="similarGames" class="row g-3"></div>
        </section>
      `;

      d.innerHTML = html;

      // --- fetch des jeux similaires sans plantage JSON ---
      fetch(
        `https://api.rawg.io/api/games/${game.id}/suggested?key=${RAWG_API_KEY}&page_size=4`
      )
        .then((res) => {
          if (!res.ok) return null;
          return res.text();
        })
        .then((text) => {
          if (!text) return;
          let sim;
          try {
            sim = JSON.parse(text);
          } catch (e) {
            console.error("JSON suggestions invalide", e);
            return;
          }
          const simGrid = document.getElementById("similarGames");
          sim.results.forEach((g2) => {
            const c = document.createElement("div");
            c.className = "col-6 col-md-3";
            c.innerHTML = `
              <div class="card h-100">
                <img src="${g2.background_image}" class="card-img-top" alt="${g2.name}">
                <div class="card-body p-2">
                  <h6 class="card-title mb-1">${g2.name}</h6>
                </div>
              </div>
            `;
            c.querySelector(".card").addEventListener("click", () => {
              window.location.hash = `#game/${encodeURIComponent(g2.slug)}`;
            });
            simGrid.append(c);
          });
        })
        .catch((err) => console.error("Fetch suggestions erreur", err));
    })
    .catch((err) => {
      console.error("Fetch détail erreur", err);
      document.getElementById("detail").innerHTML = `
        <div class="text-center text-danger">
          <h3>Erreur de chargement</h3>
        </div>
      `;
    });
}
