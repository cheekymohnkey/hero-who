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
  
  return carouselContainer;
}

// Function to render View Mode
function renderHeroView(hero) {
  const viewMode = document.getElementById('viewMode');
  viewMode.innerHTML = `
    <div class="hero-info">
      <h1>${hero.name}</h1>
      <p>${hero.intro}</p>
      <img src="hero-images/${hero.id}.png" class="hero-image" />
      <div class="appearance">
        <h2>Appearance</h2>
        <p>${hero.appearance.description}</p>
      </div>
      <div class="abilities">
        <h2>Abilities</h2>
        <ul>
          ${hero.abilities.map(ability => `
            <li>
              <strong>${ability.name}:</strong> ${ability.description}
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="personality">
        <h2>Personality</h2>
        <p>${hero.personality}</p>
      </div>
      <div class="favourite-phrases">
        <h2>Favourite Phrases</h2>
        <ul>
          ${hero.favouritePhrases.map(phrase => `<li>${phrase}</li>`).join('')}
        </ul>
      </div>
      <div class="background">
        <h2>Background</h2>
        <p>${hero.background}</p>
      </div>
      <div class="mantra">
        <h2>Mantra</h2>
        <p>${hero.mantra}</p>
      </div>
      <div class="outro">
        <h2>Outro</h2>
        <p>${hero.outro}</p>
      </div>
      
    </div>
  `;
  const carousel = renderCarousel(hero.images);
  if (carousel) {
    viewMode.appendChild(carousel);
  }
}

// Function to render Edit Mode
function renderEditMode(hero) {
  const editMode = document.getElementById('editMode');
  editMode.innerHTML = `
    <div class="edit-section">
      <label for="editName">Name:</label>
      <input type="text" id="editName" value="${hero.name}" />
    </div>
    <div class="edit-section">
      <label for="editIntro">Introduction:</label>
      <textarea id="editIntro">${hero.intro}</textarea>
    </div>
    <div class="edit-section">
      <label for="editAppearance">Appearance:</label>
      <textarea id="editAppearance">${hero.appearance.description}</textarea>
    </div>
    <div class="edit-section">
      <label for="editAbilities">Abilities:</label>
      <div id="abilitiesList">
        ${hero.abilities.map((ability, index) => `
          <div class="ability-item">
            <input type="text" class="ability-name" data-index="${index}" value="${ability.name}" placeholder="Ability Name" />
            <textarea class="ability-description" data-index="${index}" placeholder="Ability Description">${ability.description}</textarea>
            <button class="remove-ability" data-index="${index}">Remove</button>
          </div>
        `).join('')}
      </div>
      <button id="addAbilityButton">Add Ability</button>
    </div>
    <div class="edit-section">
      <label for="editFavouritePhrases">Favourite Phrases:</label>
      <div id="phrasesList">
        ${hero.favouritePhrases.map((phrase, index) => `
          <div class="phrase-item">
            <input type="text" class="phrase-text" data-index="${index}" value="${phrase}" placeholder="Phrase" />
            <button class="remove-phrase" data-index="${index}">Remove</button>
          </div>
        `).join('')}
      </div>
      <button id="addPhraseButton">Add Phrase</button>
    </div>
    <div class="edit-section">
      <label for="editImages">Images:</label>
      <div id="imageList">
        ${hero.images.map((img, index) => `
          <div class="image-item">
            <input type="text" class="image-url" data-index="${index}" value="${img.url}" placeholder="Image URL" />
            <input type="text" class="image-caption" data-index="${index}" value="${img.caption}" placeholder="Caption" />
            <button class="remove-image" data-index="${index}">Remove</button>
          </div>
        `).join('')}
      </div>
      <button id="addImageButton">Add Image</button>
    </div>
  `;

  // Attach event listeners
  document.getElementById('addAbilityButton').addEventListener('click', addAbilityField);
  document.getElementById('addPhraseButton').addEventListener('click', addPhraseField);
  document.getElementById('addImageButton').addEventListener('click', addImageField);
  document.querySelectorAll('.remove-ability').forEach(btn => btn.addEventListener('click', removeAbilityField));
  document.querySelectorAll('.remove-phrase').forEach(btn => btn.addEventListener('click', removePhraseField));
  document.querySelectorAll('.remove-image').forEach(btn => btn.addEventListener('click', removeImageField));
}


heroSelect.addEventListener("change", (e) => {
  const selectedHero = heroes[e.target.value];
  renderHeroView(selectedHero);
  renderEditMode(selectedHero);
});

// Function to add a new ability field
function addAbilityField() {
  const abilitiesList = document.getElementById('abilitiesList');
  const newAbilityIndex = abilitiesList.children.length;
  const newAbilityItem = document.createElement('div');
  newAbilityItem.classList.add('ability-item');
  newAbilityItem.innerHTML = `
    <input type="text" class="ability-name" data-index="${newAbilityIndex}" placeholder="Ability Name" />
    <textarea class="ability-description" data-index="${newAbilityIndex}" placeholder="Ability Description"></textarea>
    <button class="remove-ability" data-index="${newAbilityIndex}">Remove</button>
  `;
  abilitiesList.appendChild(newAbilityItem);

  // Attach event listener to remove button
  newAbilityItem.querySelector('.remove-ability').addEventListener('click', removeAbilityField);
}

// Function to remove an ability field
function removeAbilityField(event) {
  const index = event.target.getAttribute('data-index');
  const abilityItem = document.querySelector(`.ability-item [data-index="${index}"]`).closest('.ability-item');
  abilityItem.remove();
}

// Function to add a new phrase field
function addPhraseField() {
  const phrasesList = document.getElementById('phrasesList');
  const newPhraseIndex = phrasesList.children.length;
  const newPhraseItem = document.createElement('div');
  newPhraseItem.classList.add('phrase-item');
  newPhraseItem.innerHTML = `
    <input type="text" class="phrase-text" data-index="${newPhraseIndex}" placeholder="Phrase" />
    <button class="remove-phrase" data-index="${newPhraseIndex}">Remove</button>
  `;
  phrasesList.appendChild(newPhraseItem);

  // Attach event listener to remove button
  newPhraseItem.querySelector('.remove-phrase').addEventListener('click', removePhraseField);
}

// Function to remove a phrase field
function removePhraseField(event) {
  const index = event.target.getAttribute('data-index');
  const phraseItem = document.querySelector(`.phrase-item [data-index="${index}"]`).closest('.phrase-item');
  phraseItem.remove();
}

// Function to add a new image field
function addImageField() {
  const imageList = document.getElementById('imageList');
  const newImageIndex = imageList.children.length;
  const newImageItem = document.createElement('div');
  newImageItem.classList.add('image-item');
  newImageItem.innerHTML = `
    <input type="text" class="image-url" data-index="${newImageIndex}" placeholder="Image URL" />
    <input type="text" class="image-caption" data-index="${newImageIndex}" placeholder="Caption" />
    <button class="remove-image" data-index="${newImageIndex}">Remove</button>
  `;
  imageList.appendChild(newImageItem);

  // Attach event listener to remove button
  newImageItem.querySelector('.remove-image').addEventListener('click', removeImageField);
}

// Function to remove an image field
function removeImageField(event) {
  const index = event.target.getAttribute('data-index');
  const imageItem = document.querySelector(`.image-item [data-index="${index}"]`).closest('.image-item');
  imageItem.remove();
}

// Function to save changes back to the hero object
function saveChanges() {
  const hero = heroes[heroSelect.value];

  // Update basic fields
  hero.name = document.getElementById('editName').value;
  hero.intro = document.getElementById('editIntro').value;
  hero.appearance.description = document.getElementById('editAppearance').value;

  // Update abilities
  hero.abilities = Array.from(document.querySelectorAll('.ability-item')).map(abilityItem => ({
    name: abilityItem.querySelector('.ability-name').value,
    description: abilityItem.querySelector('.ability-description').value
  }));

  // Update favourite phrases
  hero.favouritePhrases = Array.from(document.querySelectorAll('.phrase-item')).map(phraseItem =>
    phraseItem.querySelector('.phrase-text').value
  );

  // Update images
  hero.images = Array.from(document.querySelectorAll('.image-item')).map(imageItem => ({
    url: imageItem.querySelector('.image-url').value,
    caption: imageItem.querySelector('.image-caption').value
  }));

  // Save completed, switch back to view mode
  toggleEditMode(false);
}

// Function to toggle between Edit Mode and View Mode
function toggleEditMode(isEditing) {
  const viewMode = document.getElementById('viewMode');
  const editMode = document.getElementById('editMode');
  const saveButton = document.getElementById('saveButton');
  const editButton = document.getElementById('editButton');

  if (isEditing) {
    renderEditMode(heroes[heroSelect.value]);
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
    saveButton.style.display = 'block';
    editButton.style.display = 'none';
  } else {
    renderHeroView(heroes[heroSelect.value]);
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
    saveButton.style.display = 'none';
    editButton.style.display = 'block';
  }
}
// Function to add a new hero from JSON input
function addNewHero() {
  const newHeroJsonInput = document.getElementById('newHeroJson').value;
  const errorElement = document.getElementById('newHeroError');
  errorElement.style.display = 'none'; // Reset error message

  try {
    // Parse the JSON input
    const newHero = JSON.parse(newHeroJsonInput);

    // Validate required fields
    if (!newHero.id || !newHero.name || !newHero.appearance || !newHero.abilities || !newHero.images) {
      throw new Error("Missing required fields: 'id', 'name', 'appearance', 'abilities', or 'images'.");
    }

    // Add the new hero to the heroes collection
    heroes.push(newHero);

    // Refresh the hero dropdown
    refreshHeroDropdown();

    // Clear the input field
    document.getElementById('newHeroJson').value = '';

    // Set the newly added hero as selected
    heroSelect.value = heroes.length - 1;
    renderHeroView(newHero);

    alert('New hero added successfully!');
  } catch (error) {
    // Display error message
    errorElement.textContent = `Error: ${error.message}`;
    errorElement.style.display = 'block';
  }
}

// Function to refresh the hero dropdown after adding a new hero
function refreshHeroDropdown() {
  heroSelect.innerHTML = ''; // Clear existing options
  heroes.forEach((hero, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = hero.name;
    heroSelect.appendChild(option);
  });
}

// Attach the addNewHero function to the button
document.getElementById('addNewHeroButton').addEventListener('click', addNewHero);

// Attach save and edit button functionality
document.getElementById('saveButton').addEventListener('click', saveChanges);
document.getElementById('editButton').addEventListener('click', () => toggleEditMode(true));

// Copy JSON to clipboard
function copyToClipboard() {
navigator.clipboard.writeText(JSON.stringify(heroes, null, 2))
  .then(() => alert('Heroes JSON copied to clipboard!'))
  .catch(err => alert('Failed to copy JSON: ' + err));
}

async function saveHeroesToAWS() {
  const awsButton = document.getElementById('awsButton');
  awsButton.disabled = true; // Prevent multiple clicks

  try {
    const response = await fetch('https://25gpvyquj2.execute-api.ap-southeast-2.amazonaws.com/prod/save-heroes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroes),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const result = await response.json();
    alert(result.message);
  } catch (error) {
    console.error('Error saving heroes:', error);
    alert('Failed to save heroes. Please try again.');
  } finally {
    awsButton.disabled = false;
  }
}

// Attach the saveHeroes function to the "Save" button
document.getElementById('awsButton').addEventListener('click', saveHeroesToAWS);


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