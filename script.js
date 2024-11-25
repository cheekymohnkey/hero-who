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
  function displayHeroView(hero) {
    document.getElementById('viewName').textContent = hero.name;
    document.getElementById('viewIntro').textContent = hero.intro;
    document.getElementById('viewAppearance').textContent = hero.appearance.description;
    document.getElementById('viewAbilities').innerHTML = "<ol>" + hero.abilities.map(a => `<li><strong>${a.name}</strong><p>${a.description}</p></li>`).join('') + "</ol>";
    document.getElementById('viewPersonality').textContent = hero.personality;
    document.getElementById('viewPhrases').innerHTML = hero.favouritePhrases.map(a => `<span>${a}</span>`).join('');
    document.getElementById('viewBackground').textContent = hero.background;
    document.getElementById('viewMantra').textContent = hero.mantra;
    document.getElementById('viewOutro').textContent = hero.outro;
    document.getElementById('viewImages').innerHTML = hero.images.map(a => `<div class="image-container"><img src="${a.url}" /><div class="caption">${a.caption}</div></div>`).join('');
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
  heroSelect.addEventListener('change', () => {
    const selectedHero = heroes[heroSelect.value];
    displayHeroView(selectedHero);
    switchToViewMode();
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

    displayHeroView(selectedHero);
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
  displayHeroView(heroes[0]);