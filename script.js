  const heroSelect = document.getElementById('heroSelect');
  const viewMode = document.getElementById('viewMode');
  const heroForm = document.getElementById('heroForm');
  const editButton = document.getElementById('editButton');
  const saveHero = document.getElementById('saveHero');
  const cancelEdit = document.getElementById('cancelEdit');

  // Populate dropdown
  heroes.forEach((hero, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = hero.name;
    heroSelect.appendChild(option);
  });

  // Display hero in view mode
  function renderHeroView(hero) {
    viewMode.innerHTML = `
      <img src="hero-images/${hero.id}.png" alt="${hero.name}" class="hero-image">
      <div class="view-section">
        <h2>${hero.name}</h2>
        <p>${hero.intro}</p>
      </div>
      <div class="view-section">
        <h2>Appearance</h2>
        <p>${hero.appearance.description}</p>
      </div>
      <div class="view-section">
        <h2>Abilities</h2>
        <ul>
          ${hero.abilities.map(ability => `<li><strong>${ability.name}:</strong> ${ability.description}</li>`).join('')}
        </ul>
      </div>
      <div class="view-section">
        <h2>Personality</h2>
        <p>${hero.personality}</p>
      </div>
      <div class="view-section">
        <h2>Favourite Phrases</h2>
        <ul>${hero.favouritePhrases.map(phrase => `<li>"${phrase}"</li>`).join('')}</ul>
      </div>
      <div class="view-section">
        <h2>Background</h2>
        <p>${hero.background}</p>
      </div>
      <div class="view-section">
        <h2>Mantra</h2>
        <p><em>${hero.mantra}</em></p>
      </div>
      <div class="view-section">
        <h2>Outro</h2>
        <p>${hero.outro}</p>
      </div>
      <div class="view-section">
        <h2>Images</h2>
        <div class="images-container">
          ${hero.images.map(image => `
            <div class="image-card">
              <img src="${image.url}" alt="Hero image">
              <div class="caption">${image.caption}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Display hero in edit mode
  function displayHeroEdit(hero) {
    document.getElementById('heroName').value = hero.name;
    document.getElementById('heroIntro').value = hero.intro;
    document.getElementById('heroAppearance').value = hero.appearance.description;
    document.getElementById('heroAbilities').value = JSON.stringify(hero.abilities, null, 2);
    document.getElementById('heroPersonality').value = hero.personality;
    document.getElementById('heroPhrases').value = hero.favouritePhrases.join(', ');
    document.getElementById('heroBackground').value = hero.background;
    document.getElementById('heroMantra').value = hero.mantra;
    document.getElementById('heroOutro').value = hero.outro;
    document.getElementById('heroImages').value = JSON.stringify(hero.images, null, 2);
  }

  // Switch to view mode
  function switchToViewMode() {
    heroForm.classList.add('hidden');
    viewMode.classList.remove('hidden');
  }

  // Switch to edit mode
  function switchToEditMode() {
    viewMode.classList.add('hidden');
    heroForm.classList.remove('hidden');
  }

  // Load selected hero
  heroSelect.addEventListener("change", (e) => {
    const selectedHero = heroes[e.target.value];
    renderHeroView(selectedHero);
  });

  // Edit button click
  editButton.addEventListener('click', () => {
    const selectedHero = heroes[heroSelect.value];
    displayHeroEdit(selectedHero);
    switchToEditMode();
  });

  // Save button click
  saveHero.addEventListener('click', () => {
    const selectedHero = heroes[heroSelect.value];
    selectedHero.name = document.getElementById('heroName').value;
    selectedHero.intro = document.getElementById('heroIntro').value;
    selectedHero.appearance.description = document.getElementById('heroAppearance').value;
    selectedHero.abilities = JSON.parse(document.getElementById('heroAbilities').value);
    selectedHero.personality = document.getElementById('heroPersonality').value;
    selectedHero.favouritePhrases = document.getElementById('heroPhrases').value.split(',').map(phrase => phrase.trim());
    selectedHero.background = document.getElementById('heroBackground').value;
    selectedHero.mantra = document.getElementById('heroMantra').value;
    selectedHero.outro = document.getElementById('heroOutro').value;
    selectedHero.images = JSON.parse(document.getElementById('heroImages').value);

    renderHeroView(selectedHero);
    switchToViewMode();
  });

  // Cancel button click
  cancelEdit.addEventListener('click', switchToViewMode);

  // Handle download button click
 
  const downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", () => {
    const json = JSON.stringify(heroes, null, 2); // Convert heroes array to JSON string
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = "heroes.json"; // File name
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  });

// Handle copy button click
const copyButton = document.getElementById("copyButton");
copyButton.addEventListener("click", async () => {
  try {
    const json = JSON.stringify(heroes, null, 2); // Convert heroes array to JSON string
    await navigator.clipboard.writeText(json); // Copy to clipboard
    alert("Heroes JSON copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy JSON to clipboard: ", err);
    alert("Failed to copy JSON to clipboard.");
  }
});

  // Load first hero on page load
  heroSelect.value = 0;
  renderHeroView(heroes[0]);