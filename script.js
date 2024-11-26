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

      function updateCarousel() {
        imageElement.src = images[currentImageIndex].url;
        imageElement.alt = images[currentImageIndex].caption;
        caption.textContent = images[currentImageIndex].caption;
      }

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

    heroSelect.addEventListener("change", (e) => {
      const selectedHero = heroes[e.target.value];
      renderHeroView(selectedHero);
    });

    // Initialize
    renderHeroOptions();
    renderHeroView(heroes[0]);