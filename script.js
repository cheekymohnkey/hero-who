const heroSelect = document.getElementById("heroSelect");
const viewMode = document.getElementById("viewMode");

function renderHeroOptions() {
  heroes.forEach((hero, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = hero.name;
    heroSelect.appendChild(option);
  });
}

function setupCarouselKeyboardNavigation(carousel) {
  const images = carousel.querySelectorAll("img");
  carousel.addEventListener("mouseover", () => {
    document.addEventListener("keydown", handleCarouselKeys);
  });
  carousel.addEventListener("mouseout", () => {
    document.removeEventListener("keydown", handleCarouselKeys);
  });

  function handleCarouselKeys(event) {
    if (event.key === "ArrowRight") {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateCarousel();
    } else if (event.key === "ArrowLeft") {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updateCarousel();
    }
  }
}

function renderCarousel(images) {
  if (!images || images.length === 0) return "";
  let currentImageIndex = 0;

  const carouselContainer = document.createElement("div");
  carouselContainer.classList.add("carousel");

  const imageElement = document.createElement("img");
  imageElement.src = images[currentImageIndex].url;
  imageElement.alt = images[currentImageIndex].caption;
  imageElement.addEventListener("click", () => {
    window.open(images[currentImageIndex].url, "_blank");
  });

  const caption = document.createElement("div");
  caption.classList.add("caption");
  caption.textContent = images[currentImageIndex].caption;

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
  carouselContainer.appendChild(caption);
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
    imageElement.src = images[currentImageIndex].url;
    imageElement.alt = images[currentImageIndex].caption;
    caption.textContent = images[currentImageIndex].caption;
  }
  setupCarouselKeyboardNavigation(carouselContainer);
  return carouselContainer;
}

function renderHeroView(hero) {
  viewMode.innerHTML = `
    <div class="view-section">
      <h1>${hero.name}</h1>
      <p>${hero.intro}</p>
    </div>
     <img src="hero-images/${hero.id}.png" alt="${hero.name}" class="hero-image">
    <div class="view-section hero-field">
      <strong>Appearance:</strong>
      <p>${hero.appearance.description}</p>
    </div>
    <div class="view-section hero-field">
      <strong>Abilities:</strong>
      <ol>
        ${hero.abilities.map(ability => `<li><strong>${ability.name}:</strong> ${ability.description}</li>`).join('')}
      </ol>
    </div>
    <div class="view-section hero-field">
      <strong>Personality:</strong>
      <p>${hero.personality}</p>
    </div>
    <div class="view-section hero-field">
      <strong>Favourite Phrases:</strong>
      <ul>${hero.favouritePhrases.map(phrase => `<li>"${phrase}"</li>`).join('')}</ul>
    </div>
    <div class="view-section hero-field">
      <strong>Background:</strong>
      <p>${hero.background}</p>
    </div>
    <div class="view-section hero-field">
      <strong>Mantra:</strong>
      <p><em>${hero.mantra}</em></p>
    </div>
    <div class="view-section hero-field">
      <strong>Outro:</strong>
      <p>${hero.outro}</p>
    </div>
  `;

  const carousel = renderCarousel(hero.images);
  if (carousel) {
    viewMode.appendChild(carousel);
  }
}

function renderEditHero(hero) {
  const editMode = document.getElementById("editMode");
  editMode.innerHTML = `
    <div class="edit-section">
      <label>
        Name: <input type="text" id="editName" value="${hero.name}">
      </label>
    </div>
    <div class="edit-section">
      <label>
        Intro: <textarea id="editIntro">${hero.intro}</textarea>
      </label>
    </div>
    <div class="edit-section">
      <label>
        Appearance: <textarea id="editAppearance">${hero.appearance.description}</textarea>
      </label>
    </div>
    <div class="edit-section">
      <label>
        Personality: <textarea id="editPersonality">${hero.personality}</textarea>
      </label>
    </div>
    <div class="edit-section">
      <label>
        Favourite Phrases: <textarea id="editPhrases">${hero.favouritePhrases.join("\n")}</textarea>
      </label>
    </div>
    <div class="edit-section">
      <label>
        Background: <textarea id="editBackground">${hero.background}</textarea>
      </label>
    </div>
    <div class="edit-section">
      <label>
        Mantra: <input type="text" id="editMantra" value="${hero.mantra}">
      </label>
    </div>
    <div class="edit-section">
      <label>
        Outro: <textarea id="editOutro">${hero.outro}</textarea>
      </label>
    </div>
    <button onclick="saveHero()">Save Changes</button>
  `;
}

function saveHero() {
  const selectedHeroIndex = heroSelect.value;
  const selectedHero = heroes[selectedHeroIndex];

  // Update hero properties from inputs
  selectedHero.name = document.getElementById("editName").value;
  selectedHero.intro = document.getElementById("editIntro").value;
  selectedHero.appearance.description = document.getElementById("editAppearance").value;
  selectedHero.personality = document.getElementById("editPersonality").value;
  selectedHero.favouritePhrases = document.getElementById("editPhrases").value.split("\n");
  selectedHero.background = document.getElementById("editBackground").value;
  selectedHero.mantra = document.getElementById("editMantra").value;
  selectedHero.outro = document.getElementById("editOutro").value;

  // Refresh view mode
  renderHeroView(selectedHero);
  toggleEditMode();
}


heroSelect.addEventListener("change", (e) => {
  const selectedHero = heroes[e.target.value];
  renderHeroView(selectedHero);
});

// Toggle between View and Edit modes
function toggleEditMode() {
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");
  const editButton = document.getElementById("editButton");

  if (editMode.classList.contains("hidden")) {
    renderEditHero(heroes[heroSelect.value]);
    viewMode.classList.add("hidden");
    editMode.classList.remove("hidden");
    editButton.textContent = "View";
  } else {
    viewMode.classList.remove("hidden");
    editMode.classList.add("hidden");
    editButton.textContent = "Edit";
  }
}

// Copy JSON to clipboard
function copyToClipboard() {
navigator.clipboard.writeText(JSON.stringify(heroes, null, 2))
  .then(() => alert('Heroes JSON copied to clipboard!'))
  .catch(err => alert('Failed to copy JSON: ' + err));
}

// Download JSON
function downloadJSON() {
const jsonBlob = new Blob([JSON.stringify(heroes, null, 2)], { type: 'application/json' });
const downloadLink = document.createElement('a');
downloadLink.href = URL.createObjectURL(jsonBlob);
downloadLink.download = 'heroes.json';
downloadLink.click();
}

// Initialize
renderHeroOptions();
renderHeroView(heroes[0]);