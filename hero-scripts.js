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
      <div class="abilities class-attribute">
        <h2>Abilities</h2>
        ${hero.abilityProgression.length > 0 ? `
        ${hero.abilityProgression.map(currentLevel => `
            <div class="level">
              <h3>Level ${currentLevel.level}</h3>
              <h4>Recommended Attributes at this level</h4>
              <p>
                Health: <strong>${currentLevel.recommendedAttributes.health}</strong><br />
                Attack: <strong>${currentLevel.recommendedAttributes.attack}</strong><br />
                Energy: <strong>${currentLevel.recommendedAttributes.energy}</strong>
              </p>
              ${currentLevel.changes.length > 0 ? ` 
              <h4>Changes  in this level:</h4>
              <ul>
                 ${currentLevel.changes.map(change => `<li>${change}</li>`).join('')}
              </ul>` : ""}
              <h4>Abilities</h4>
              <ul>
                ${currentLevel.abilities.map(ability => `
                  <li>
                    <p><strong>${ability.name}</strong></p>
                    <p>${ability.description}</p>
                    <p>An <strong>${ability.type}</strong> ability from the <strong>${ability.specialisation}</strong> specialisation${ability.type === "Passive" ? "." : `, it requires <strong>${ability.energyCost} energy to use.</strong>`}</p>
                  </li>
                    `).join('')}
              </ul>
            </div>
          `).join('')}
        ` : '<p>Still being developed.</p>'}
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