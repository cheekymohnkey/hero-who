const heroSelect = document.getElementById("heroSelect");
const baseUrl = "https://d3qf3z2eo3azpe.cloudfront.net/";
heroes.sort(function (a, b) {
  a = a.name.toLowerCase();
  b = b.name.toLowerCase();

  return a < b ? -1 : a > b ? 1 : 0;
});

function renderHeroOptions(herolist) {
  heroSelect.length = 0;
  herolist.forEach((hero, index) => {
    const option = document.createElement("option");
    option.value = hero.id;
    option.textContent = hero.name;
    heroSelect.appendChild(option);
  });
  renderHeroView(herolist[0]);
}

// Function to populate the dropdown with unique primary classes
function populateFilterOptions() {
  const heroFilter = document.getElementById('heroFilter');

  // Extract unique primary classes from the hero collection
  const uniqueClasses = ['all', ...new Set(heroes.map(hero => hero.primaryClass))];

  // Populate the dropdown with the unique classes
  heroFilter.innerHTML = uniqueClasses.map(primaryClass => `
    <option value="${primaryClass}">${primaryClass === 'all' ? 'All Classes' : primaryClass}</option>
  `).join('');
  
}

function filterHeroes() {
  const selectedClass = document.getElementById('heroFilter').value;

  if (selectedClass === 'all') {
    renderHeroOptions(heroes); // Show all heroes
  } else {
    const filteredHeroes = heroes.filter(hero => hero.primaryClass === selectedClass);
    renderHeroOptions(filteredHeroes);
  }
}


function renderCarousel(images) {
  if (!images || images.length === 0) return "";
  let currentImageIndex = 0;

  const carouselContainer = document.createElement("div");
  carouselContainer.classList.add("carousel");
  const imageElement = document.createElement("img");
  imageElement.src = baseUrl + images[currentImageIndex].url;
  imageElement.alt = images[currentImageIndex].caption;
  imageElement.addEventListener("click", () => {
    window.open(images[currentImageIndex].url, "_blank");
  });
  const controls = document.createElement("div");
  controls.classList.add("carousel-controls");

  const prevButton = document.createElement("button");
  prevButton.classList.add("prev");
  prevButton.textContent = "<";
  prevButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateCarousel();
  });

  const nextButton = document.createElement("button");
  nextButton.classList.add("next");
  nextButton.textContent = ">";
  nextButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarousel();
  });

  controls.appendChild(prevButton);
  controls.appendChild(nextButton);

  carouselContainer.appendChild(imageElement);
  carouselContainer.appendChild(controls);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateCarousel();
    } else if (event.key === 'ArrowLeft') {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updateCarousel();
    }
  });

  function updateCarousel() {
    imageElement.src = baseUrl + images[currentImageIndex].url;
    imageElement.alt = images[currentImageIndex].caption;
    const caption = document.getElementsByClassName("caption")[0];
    caption.innerHTML = `<div class="quote">
  <blockquote>
    <p>${wrapQuotes(images[currentImageIndex].caption)}</p>
  </blockquote>
</div>`;
  }

  return carouselContainer;
}

// Function to render View Mode
function renderHeroView(hero) {
  const heroContainer = document.getElementById('heroContainer');
  heroContainer.innerHTML = `
    <div class="hero-info">
      <h1>${hero.name}</h1>
      <p>${hero.intro}</p>
      <img src="hero-images/${hero.id}.png" class="hero-image" />
      <div class="class class-attribute">
        <h2>Class</h2>
        <p>
          <strong>Class Name:</strong> ${hero.uniqueClassName}<br />
          <strong>Main Specialty:</strong> ${hero.primaryClass}<br />
          <strong class="specialty">Secondary Specialty:</strong> ${hero.secondaryClass}
        </p>
      </div>
      <div class="appearance class-attribute">
        <h2>Appearance</h2>
        <p>${hero.appearance.description}</p>
      </div>
      <div class="basicAttack class-attribute">
        <h2>Basic Attack</h2>
        <p><strong>${hero.basicAttack.type === 'contact' ? 'Close contact attack' : 'Ranged attack'}</strong>
        <br />${hero.basicAttack.description}</p>
      </div>
      <div class="level-selector ${hero.abilityProgression.length == 0 ? 'hidden"' : ''}>
        <label for="levelSelect">Select Level:</label>
        <select id="levelSelect">
          <option value="all">All Levels</option>
          ${hero.abilityProgression
            .map(
              (level) => `<option value="${level.level}">Level ${level.level}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="abilities class-attribute">
        <h2>Abilities</h2>
        <div id="filteredAbilities">
          <!-- Abilities will render dynamically based on selected level -->
        </div>
      </div>
      <div class="personality class-attribute">
        <h2>Personality</h2>
        <p>${hero.personality}</p>
      </div>
      <div class="favourite-phrases class-attribute">
        <h2>Favourite Phrases</h2>
        <ul>
          ${hero.favouritePhrases.map(phrase => `<li>${phrase}</li>`).join('')}
        </ul>
      </div>
      <div class="background class-attribute">
        <h2>Background</h2>
        <p>${hero.background}</p>
      </div>
      <div class="mantra class-attribute">
        <h2>Mantra</h2>
        <p>${hero.mantra}</p>
      </div>
      <div class="outro class-attribute">
        <h2>Outro</h2>
        <p>${hero.outro}</p>
      </div>
    </div>
  `;
  const carousel = renderCarousel(hero.images);
  if (carousel) {
    heroContainer.appendChild(carousel);

    const caption = document.createElement("div");
    caption.classList.add("caption");
    caption.innerHTML = `<div class="quote">
    <blockquote>
      <p>${wrapQuotes(hero.images[0].caption)}</p>
    </blockquote>
    </div>`;
    heroContainer.appendChild(caption);
  }
  const levelSelect = document.getElementById("levelSelect");
  levelSelect.addEventListener("change", () => {
    const selectedValue = levelSelect.value;
    if (selectedValue === "all") {
      updateAbilitiesForAllLevels(hero);
    } else {
      updateAbilitiesForLevel(hero, parseInt(selectedValue, 10));
    }
  });

  // Render abilities for "All Levels" by default
  updateAbilitiesForAllLevels(hero);
}

function updateAbilitiesForAllLevels(hero) {
  const filteredAbilitiesContainer = document.getElementById("filteredAbilities");

  if(hero.abilityProgression.length > 0) {
  filteredAbilitiesContainer.innerHTML = hero.abilityProgression
    .map(
      (level) => `
        <div class="level">
          <h3>Level ${level.level}</h3>
          <h4>Recommended Attributes:</h4>
          <p>
            Health: <strong>${level.recommendedAttributes.health}</strong><br />
            Attack: <strong>${level.recommendedAttributes.attack}</strong><br />
            Energy: <strong>${level.recommendedAttributes.energy}</strong>
          </p>
          <h4>Abilities:</h4>
          <ul>
            ${level.abilities
              .map(
                (ability) => `
                  <li>
                    <p><strong>${ability.name}</strong></p>
                    <p>${ability.description}</p>
                    ${
                      ability.type !== "Passive"
                        ? `<p>Energy Cost: <strong>${ability.energyCost}</strong></p>`
                        : ""
                    }
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      `
    )
    .join("");
  }
  else
  {
    filteredAbilitiesContainer.innerHTML = "<p>This hero is still being full developed and as yet hasn't had their abilities developed.</p>"
  }
}

function updateAbilitiesForLevel(hero, selectedLevel) {
  const filteredAbilitiesContainer = document.getElementById("filteredAbilities");
  const selectedLevelData = hero.abilityProgression.find(
    (level) => level.level === selectedLevel
  );

  if (!selectedLevelData) {
    filteredAbilitiesContainer.innerHTML = "<p>No abilities available for this level.</p>";
    return;
  }

  filteredAbilitiesContainer.innerHTML = `
    <div class="level">
      <h3>Level ${selectedLevel}</h3>
      <h4>Recommended Attributes:</h4>
      <p>
        Health: <strong>${selectedLevelData.recommendedAttributes.health}</strong><br />
        Attack: <strong>${selectedLevelData.recommendedAttributes.attack}</strong><br />
        Energy: <strong>${selectedLevelData.recommendedAttributes.energy}</strong>
      </p>
      <h4>Abilities:</h4>
      <ul>
        ${selectedLevelData.abilities
          .map(
            (ability) => `
              <li>
                <p><strong>${ability.name}</strong></p>
                <p>${ability.description}</p>
                ${
                  ability.type !== "Passive"
                    ? `<p>Energy Cost: <strong>${ability.energyCost}</strong></p>`
                    : ""
                }
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
}


function wrapQuotes(text) {
  // Match straight quotes and smart quotes
  return text.replace(/["“”]([^"“”]*)["“”]/g, '<span class="quotespan">$1</span>');
}

renderHeroOptions(heroes);
populateFilterOptions(heroes);
document.getElementById('heroFilter').addEventListener('change', filterHeroes);
const hero=heroes[0];

heroSelect.addEventListener("change", (e) => {
  const hero = heroes.find(hero => hero.id == e.target.value);
  renderHeroView(hero);
});



document
  .getElementById("printCharacterSheetButton")
  .addEventListener("click", () => {
    const selectedHeroId = heroSelect.value;
    const selectedHero = heroes.find((hero) => hero.id === selectedHeroId);
    const selectedLevel = document.getElementById("levelSelect").value;
    renderCharacterSheet(selectedHero, selectedLevel);
  });

  function renderCharacterSheet(hero, selectedLevel) {
    const  container = document.getElementsByClassName("container")[0];
    container.classList.add("hidden");
    const characterSheet = document.getElementById("characterSheet");
    const levelChosenIndex = selectedLevel !== "all" ? parseInt(selectedLevel) - 1: null;
    const levelChosen = levelChosenIndex !== null ? hero.abilityProgression[levelChosenIndex] : null;
    characterSheet.innerHTML = `
      <div class="hero-header">
        <h1>${hero.name}</h1>
        <h2>${hero.uniqueClassName}</h2>
        <p><strong>Primary Specialisation:</strong> ${hero.primaryClass}</p>
        ${
          hero.secondaryClass
            ? `<p><strong>Secondary Specialisation:</strong> ${hero.secondaryClass}</p>`
            : ""
        }
      </div>
  
      <div class="hero-attributes">
        <h3>Attributes</h3>
        <table>
          <tr>
            <th>Attribute</th>
            <th>Maximum</th>
            <th>Current</th>
          </tr>
          <tr>
            <td>Health</td>
            <td>${selectedLevel !== "all" ? `${hero.abilityProgression[levelChosenIndex].recommendedAttributes.health}` : ''}</td>
            <td>______</td>
          </tr>
          <tr>
            <td>Attack</td>
            <td>${selectedLevel !== "all" ? `${hero.abilityProgression[levelChosenIndex].recommendedAttributes.attack}` : ''}</td>
            <td>______</td>
          </tr>
          <tr>
            <td>Energy</td>
            <td>${selectedLevel !== "all" ? `${hero.abilityProgression[levelChosenIndex].recommendedAttributes.energy}` : ''}</td>
            <td>______</td>
          </tr>
        </table>
      </div>
  
      <div class="hero-basic-attack">
        <h3>Basic Attack</h3>
        <p>${hero.basicAttack.description}</p>
      </div>
  
      ${levelChosen != null ? `<div class="level">
            <h3>Abilities for Level ${levelChosen.level}</h3>
            <ul>
              ${levelChosen.abilities.map((ability) => `
                <li><strong>${ability.name}</strong>: ${ability.description} ${
      ability.type !== "Passive"
        ? `(Energy Cost: ${ability.energyCost})`
        : ""
    }</li>
              `).join('')}
            </ul>
          </div>` : ''}
  
      <div class="hero-personality">
        <h3>Personality</h3>
        <p>${hero.personality}</p>
      </div>
  
      <div class="hero-items">
        <h3>Items</h3>
        <p>___________________________</p>
        <p>___________________________</p>
        <p>___________________________</p>
      </div>
  
      <div class="hero-currency">
        <h3>Dollar Bucks</h3>
        <p>___________________________</p>
      </div>

      <div class="hero-abilities">
        <h3>Hero Abilities and Attributes Progression</h3>
        ${hero.abilityProgression.map((level) => `
          <div class="level">
            <h4>Level ${level.level}</h4>
            <ul>
              ${level.abilities.map((ability) => `
                <li><strong>${ability.name}</strong>: ${ability.description} ${
      ability.type !== "Passive"
        ? `(Energy Cost: ${ability.energyCost})`
        : ""
    }</li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  
    characterSheet.classList.remove("hidden");
    window.print();
    characterSheet.classList.add("hidden");
    container.classList.remove("hidden");
  }