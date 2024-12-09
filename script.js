const heroSelect = document.getElementById("heroSelect");
const viewMode = document.getElementById("viewMode");
const baseUrl = "https://hero-editor.s3.ap-southeast-2.amazonaws.com/";
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
  renderEditMode(herolist[0]);
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
  const viewMode = document.getElementById('viewMode');
  viewMode.innerHTML = `
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
    viewMode.appendChild(carousel);

    const caption = document.createElement("div");
    caption.classList.add("caption");
    caption.innerHTML = `<div class="quote">
    <blockquote>
      <p>${wrapQuotes(hero.images[0].caption)}</p>
    </blockquote>
    </div>`;
    viewMode.appendChild(caption);
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
      <label for="editUniqueClassName">Unique Class:</label>
      <input type="text" id="editUniqueClassName" value="${hero.uniqueClassName}" />
    </div>
    <div class="edit-section">
      <label for="editPrimaryClass">Primary Class:</label>
      <input type="text" id="editPrimaryClass" value="${hero.primaryClass}" />
    </div>
    <div class="edit-section">
      <label for="editSecondaryClass">Secondary Class:</label>
      <input type="text" id="editSecondaryClass" value="${hero.secondaryClass}" />
    </div>
    <div class="edit-section">
      <label for="editAppearance">Appearance:</label>
      <textarea id="editAppearance">${hero.appearance.description}</textarea>
    </div>
    <div class="edit-section">
      <label for="editBasicAttack">Basic Attack:</label>
      <textarea id="editBasicAttack">${hero.basicAttack}</textarea>
    </div>
    <div class="edit-section">
      <label for="editAbilityProgression">Ability Progression:</label>
      <div id="editAbilityProgression">
        ${hero.abilityProgression.map((levelData, levelIndex) => `
          <div class="ability-level" data-level-index="${levelIndex}">
            <h4 class="level-number">Level ${levelData.level}</h4>
            <div>
              <label>Recommended Attributes:</label>
              <input type="number" class="recommended-health" placeholder="Health" value="${levelData.recommendedAttributes.health}" />
              <input type="number" class="recommended-attack" placeholder="Attack" value="${levelData.recommendedAttributes.attack}" />
              <input type="number" class="recommended-energy" placeholder="Energy" value="${levelData.recommendedAttributes.energy}" />
            </div>
            <div>
              <label>Changes:</label>
              <textarea class="level-changes">${levelData.changes.join('\n')}</textarea>
            </div>
            <div class="level-abilities">
              <label>Abilities:</label>
              ${levelData.abilities.map((ability, abilityIndex) => `
                <div class="ability-item" data-ability-index="${abilityIndex}">
                  <input type="text" class="ability-name" placeholder="Name" value="${ability.name}" />
                  <select class="ability-type">
                    <option value="Active" ${ability.type === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Passive" ${ability.type === 'Passive' ? 'selected' : ''}>Passive</option>
                    <option value="Active (Once Per Adventure)" ${ability.type === 'Active (Once Per Adventure)' ? 'selected' : ''}>Active (Once Per Adventure)</option>
                  </select>
                  <input type="text" class="ability-specialisation" placeholder="Specialisation" value="${ability.specialisation}" />
                  <textarea class="ability-description" placeholder="Description">${ability.description}</textarea>
                  <input type="number" class="ability-energy-cost" placeholder="Energy Cost" value="${ability.energyCost || ''}" />
                  <button class="remove-ability">Remove</button>
                </div>
              `).join('')}
              <button class="add-ability">Add Ability</button>
            </div>
            <button style="background-color: indianred; width: 150px; margin: 20px 0;" class="remove-level">Remove Level</button>
          </div>
        `).join('')}
       
        </div>
      <button id="addLevelButton">Add Level</button>
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
      <label for="editBackground">Background:</label>
      <textarea id="editBackground">${hero.background}</textarea>
    </div>
    <div class="edit-section">
      <label for="editMantra">Mantra:</label>
      <textarea type="text" id="editMantra">${hero.mantra}"</textarea>
    </div>
    <div class="edit-section">
      <label for="editOutro">Outro:</label>
      <textarea id="editOutro">${hero.outro}</textarea>
    </div>
    <div class="edit-section">
      <label for="editImages">Images:</label>
      <div id="imageList">
        ${hero.images.map((img, index) => `
          <div class="image-item">
            <input type="text" class="image-url" data-index="${index}" value="${img.url}" placeholder="Image URL" />
            <textarea class="image-caption" data-index="${index}"placeholder="Caption" />${img.caption}</textarea>
            <button class="remove-image" data-index="${index}">Remove</button>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 5px;">
        <button id="addImageButton">Add Image</button>
      </div>
    </div>
        <div class="id">
        <h3>ID (Read Only)</h2>
        <p>${hero.id}</p>
    </div>
  `;

  // Attach event listeners
  document.getElementById('addPhraseButton').addEventListener('click', addPhraseField);
  document.getElementById('addImageButton').addEventListener('click', addImageField);

  document.querySelectorAll('.remove-phrase').forEach(btn => btn.addEventListener('click', removePhraseField));
  document.querySelectorAll('.remove-image').forEach(btn => btn.addEventListener('click', removeImageField));
  attachAbilityEventListeners();
  attachImageUploadEventListeners();
}

function attachAbilityEventListeners() {
  // Add ability
  document.querySelectorAll('.add-ability').forEach(button => {
    button.addEventListener('click', event => {
      const levelIndex = event.target.closest('.ability-level').dataset.levelIndex;
      const levelData = hero.abilityProgression[levelIndex];
      levelData.abilities.push({
        name: '',
        type: 'Active',
        specialisation: '',
        description: '',
        energyCost: 1
      });
      renderAbilityProgression();
    });
  });

  // Remove ability
  document.querySelectorAll('.remove-ability').forEach(button => {
    button.addEventListener('click', event => {
      const levelIndex = event.target.closest('.ability-level').dataset.levelIndex;
      const abilityIndex = event.target.closest('.ability-item').dataset.abilityIndex;
      hero.abilityProgression[levelIndex].abilities.splice(abilityIndex, 1);
      renderAbilityProgression();
    });
  });

  // Remove Level

  document.querySelectorAll('.remove-level').forEach(button => {
    button.addEventListener('click', event => {
      const levelIndex = event.target.closest('.ability-level').dataset.levelIndex;
      hero.abilityProgression.splice(levelIndex, 1);
      renderAbilityProgression();
    })
  });

  // Add level{}
  document.getElementById('addLevelButton').addEventListener('click', () => {
    hero.abilityProgression.push({
      level: hero.abilityProgression.length + 1,
      recommendedAttributes: { health: 0, attack: 0, energy: 0 },
      changes: [],
      abilities: []
    });
    renderEditMode(hero);
  });
}

function attachImageUploadEventListeners() {
  var imageInputs = document.querySelectorAll(".image-url");
  imageInputs.forEach((input) => {
    input.addEventListener("input", (event) => handleImageUpload(event));
  });
}

function syncAbilitiesWithUI() {
  hero.abilities = Array.from(document.querySelectorAll('.ability-item')).map(abilityItem => ({
    name: abilityItem.querySelector('.ability-name').value,
    type: abilityItem.querySelector('.ability-type').value,
    class: abilityItem.querySelector('.ability-class').value,
    description: abilityItem.querySelector('.ability-description').value
  }));
}

function moveAbilityUp(event) {
  const abilityItem = event.target.closest('.ability-item');
  const index = parseInt(abilityItem.dataset.index);

  if (index > 0) {

    syncAbilitiesWithUI();
    // Swap abilities in the array
    [hero.abilities[index - 1], hero.abilities[index]] =
      [hero.abilities[index], hero.abilities[index - 1]];

    // Re-render the abilities list
    renderAbilities();
  }
}

function moveAbilityDown(event) {
  const abilityItem = event.target.closest('.ability-item');
  const index = parseInt(abilityItem.dataset.index);

  if (index < hero.abilities.length - 1) {
    syncAbilitiesWithUI();
    // Swap abilities in the array
    [hero.abilities[index], hero.abilities[index + 1]] =
      [hero.abilities[index + 1], hero.abilities[index]];

    // Re-render the abilities list
    renderAbilities();
  }
}

document.getElementById('heroFilter').addEventListener('change', filterHeroes);

function renderAbilityProgression() {
  const abilitiesProgressionList = document.getElementById('editAbilityProgression');

  // Clear and re-render the abilities
  abilitiesProgressionList.innerHTML = hero.abilityProgression.map((levelData, levelIndex) => `
    <div class="ability-level" data-level-index="${levelIndex}">
      <h4 class="level-number">Level ${levelData.level}</h4>
      <div>
        <label>Recommended Attributes:</label>
        <input type="number" class="recommended-health" placeholder="Health" value="${levelData.recommendedAttributes.health}" />
        <input type="number" class="recommended-attack" placeholder="Attack" value="${levelData.recommendedAttributes.attack}" />
        <input type="number" class="recommended-energy" placeholder="Energy" value="${levelData.recommendedAttributes.energy}" />
      </div>
      <div>
        <label>Changes:</label>
        <textarea class="level-changes">${levelData.changes.join('\n')}</textarea>
      </div>
      <div class="level-abilities">
        <label>Abilities:</label>
        ${levelData.abilities.map((ability, abilityIndex) => `
          <div class="ability-item" data-ability-index="${abilityIndex}">
            <input type="text" class="ability-name" placeholder="Name" value="${ability.name}" />
            <select class="ability-type">
              <option value="Active" ${ability.type === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Passive" ${ability.type === 'Passive' ? 'selected' : ''}>Passive</option>
              <option value="Active (Once Per Adventure)" ${ability.type === 'Active (Once Per Adventure)' ? 'selected' : ''}>Active (Once Per Adventure)</option>
            </select>
            <input type="text" class="ability-specialisation" placeholder="Specialisation" value="${ability.specialisation}" />
            <textarea class="ability-description" placeholder="Description">${ability.description}</textarea>
            <input type="number" class="ability-energy-cost" placeholder="Energy Cost" value="${ability.energyCost || ''}" />
            <button class="remove-ability">Remove</button>
          </div>
        `).join('')}
        <button class="add-ability">Add Ability</button>
      </div>
    </div>
  `).join('');

  // Re-attach event listeners after re-rendering
  attachAbilityEventListeners();
}


async function handleImageUpload(event) {
  const url = event.target.value;

  // Validate URL format
  const validUrlPattern = /^https:\/\/cdn\.midjourney\.com\/([a-f0-9\-]+)\/[0-9]_[0-9]\.png$/;
  const match = url.match(validUrlPattern);

  if (match) {
    try {
      const guid = match[1]; // Extract GUID
      const relativePath = await uploadImageToS3(url, guid);

      // Update the corresponding image object in the model
      const imageIndex = parseInt(event.target.dataset.index, 10); // Assume index is stored in `data-index`
      if (!isNaN(imageIndex)) {
        //model.images[imageIndex].url = relativePath;

        // Update the UI with the relative path
        event.target.value = relativePath;

        // Optionally, provide feedback
        event.target.style = "background-color: #b8e4b6;";
        //alert("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    }
  }
}

var hero = heroes[0];

heroSelect.addEventListener("change", (e) => {
  hero = heroes.find(hero => hero.id == e.target.value);
  renderHeroView(hero);
  renderEditMode(hero);
});


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
    <textarea class="image-caption" data-index="${newImageIndex} placeholder="Caption"></textarea>
    <button class="remove-image" data-index="${newImageIndex}">Remove</button>
  `;
  imageList.appendChild(newImageItem);

  // Attach event listener to remove button
  newImageItem.querySelector('.remove-image').addEventListener('click', removeImageField);
  newImageItem.addEventListener("input", (event) => handleImageUpload(event));
}

// Function to remove an image field
function removeImageField(event) {
  const index = event.target.getAttribute('data-index');
  const imageItem = document.querySelector(`.image-item [data-index="${index}"]`).closest('.image-item');
  imageItem.remove();
}

// Function to save changes back to the hero object
function saveChanges() {
  const hero = heroes.find(hero => hero.id == heroSelect.value);

  // Update basic fields
  hero.name = document.getElementById('editName').value;
  hero.intro = document.getElementById('editIntro').value;
  hero.uniqueClassName = document.getElementById('editUniqueClassName').value;
  hero.primaryClass = document.getElementById('editPrimaryClass').value;
  hero.secondaryClass = document.getElementById('editSecondaryClass').value;
  hero.appearance.description = document.getElementById('editAppearance').value;
  hero.basicAttack = document.getElementById('editBasicAttack').value;
  hero.background = document.getElementById('editBackground').value;
  hero.mantra = document.getElementById('editMantra').value;
  hero.outro = document.getElementById('editOutro').value;

  // Update abilities
  // Save ability progression
  hero.abilityProgression = Array.from(document.querySelectorAll('.ability-level')).map(levelElement => ({
    level: parseInt(levelElement.querySelector('.level-number').textContent.replace('Level ', '')),
    recommendedAttributes: {
      health: parseInt(levelElement.querySelector('.recommended-health').value),
      attack: parseInt(levelElement.querySelector('.recommended-attack').value),
      energy: parseInt(levelElement.querySelector('.recommended-energy').value)
    },
    changes: levelElement.querySelector('.level-changes').value.split('\n'),
    abilities: Array.from(levelElement.querySelectorAll('.ability-item')).map(abilityElement => ({
      name: abilityElement.querySelector('.ability-name').value,
      type: abilityElement.querySelector('.ability-type').value,
      specialisation: abilityElement.querySelector('.ability-specialisation').value,
      description: abilityElement.querySelector('.ability-description').value,
      energyCost: parseInt(abilityElement.querySelector('.ability-energy-cost').value) || 0
    }))
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
  saveHeroesToAWS();
  toggleEditMode(false);
}

// Function to toggle between Edit Mode and View Mode
function toggleEditMode(isEditing) {
  const viewMode = document.getElementById('viewMode');
  const editMode = document.getElementById('editMode');
  const saveButton = document.getElementById('saveButton');
  const editButton = document.getElementById('editButton');

  if (isEditing) {
    renderEditMode(heroes.find(hero => hero.id == [heroSelect.value]));
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
    saveButton.style.display = 'block';
    editButton.style.display = 'none';
  } else {
    renderHeroView(heroes.find(hero => hero.id == [heroSelect.value]));
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
    populateFilterOptions();
    // Clear the input field
    document.getElementById('newHeroJson').value = '';

    // Set the newly added hero as selected
    heroSelect.value = newHero.id;
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

function copyHeroToClipboard() {
  var selectedID = document.getElementById('heroSelect').value;
  var hero = heroes.find(hero => hero.id == selectedID);
  navigator.clipboard.writeText(JSON.stringify(hero), null, 2)
    .then(() => alert('The Json for ' + hero.name + ' has been copied to the clipboard.'))
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
    if (result.statusCode == 200) {
      alert("Heroes JSON successfully uploaded to S3!");
    }
  } catch (error) {
    console.error('Error saving heroes:', error);
    alert('Failed to save heroes. Please try again.');
  } finally {
    awsButton.disabled = false;
  }
}

// Attach the saveHeroes function to the "Save" button
document.getElementById('awsButton').addEventListener('click', saveHeroesToAWS);

async function uploadImageToS3(imageUrl, guid) {
  const bucketUrl = "https://hero-editor.s3.ap-southeast-2.amazonaws.com/";
  const relativePath = `carousel-images/${guid}.png`;
  const uploadUrl = `${bucketUrl}${relativePath}`;

  // Fetch the image
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const imageBlob = await response.blob();
  console.log(imageBlob.size);
  // Upload to S3
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: imageBlob,
    headers: {
      "Content-Type": "image/png"
    },
  });
  console.log(uploadResponse);
  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload to S3: ${uploadResponse.statusText}`);
  }

  return relativePath;
}

// Download JSON
function downloadJSON() {
  const jsonBlob = new Blob([JSON.stringify(heroes, null, 2)], { type: 'application/json' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(jsonBlob);
  downloadLink.download = 'heroes.json';
  downloadLink.click();
}

function wrapQuotes(text) {
  // Match straight quotes and smart quotes
  return text.replace(/["“”]([^"“”]*)["“”]/g, '<span class="quotespan">$1</span>');
}

// Initialize
renderHeroOptions(heroes);
populateFilterOptions();
renderHeroView(heroes[0]);
renderHeroList(heroes);
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let isAdmin = params.admin;
if (isAdmin == "true") {
  var adminDiv = document.getElementById('admincontrols');
  adminDiv.style = "";
}

function renderHeroList(heroes) {
  const heroesContainer = document.getElementById('heroes-container');
  heroesContainer.innerHTML = ''; // Clear existing list

  heroes.forEach((hero, index) => {
    const heroItem = document.createElement('li');
    heroItem.classList.add('hero-item');

    heroItem.innerHTML = `
          <span>${hero.name} (${hero.uniqueClassName}) (${hero.id})</span>
          <button class="delete-hero" data-index="${index}">Delete</button>
      `;

    heroesContainer.appendChild(heroItem);
  });

  // Add event listeners to all delete buttons
  const deleteButtons = document.querySelectorAll('.delete-hero');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      deleteHero(index);
    });
  });
}

function deleteHero(index) {
  if (confirm(`Are you sure you want to delete this hero?`)) {
    // Remove hero from collection
    heroes.splice(index, 1);

    // Save the updated collection back to S3
    //saveHeroesCollection();

    // Re-render the list
    renderHeroOptions(heroes);
    populateFilterOptions();
    renderHeroList(heroes);
    renderHeroView(heroes[0]);
  }
}

const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector('meta[name=viewport]');

  if (el !== null) {
    let content = el.getAttribute('content');
    let re = /maximum\-scale=[0-9\.]+/g;

    if (re.test(content)) {
      content = content.replace(re, 'maximum-scale=1.0');
    } else {
      content = [content, 'maximum-scale=1.0'].join(', ')
    }

    el.setAttribute('content', content);
  }
};

const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
const checkIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if (checkIsIOS()) {
  disableIosTextFieldZoom();
}