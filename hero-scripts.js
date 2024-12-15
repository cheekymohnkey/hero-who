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
        <p>${markdown(hero.personality)}</p>
      </div>
      <div class="personality class-attribute">
        <h2>Super Critical Absolutely Crucial 100% Accurate Personality Test</h2>
        <p>${markdown(hero.quiz)}</p>
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

  if (hero.abilityProgression.length > 0) {
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
                    ${ability.type !== "Passive"
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
  else {
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
                ${ability.type !== "Passive"
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
var hero = heroes[0];

heroSelect.addEventListener("change", (e) => {
  const hero = heroes.find(hero => hero.id == e.target.value);
  renderHeroView(hero);
});

document.getElementById("printCharacterSheetButton").addEventListener("click", async () => {

      // Get the selected hero from the heroes array
      const heroId = document.getElementById("heroSelect").value;
      const selectedHero = heroes.find(hero => hero.id === heroId);

      if (!selectedHero) {
          alert("Hero not found. Please try again.");
          return;
      }

      // Define the API URL
      const apiUrl = "https://33hodf5km5.execute-api.ap-southeast-2.amazonaws.com/prod/HeroPrint";

      // Make the POST request to the Lambda function
      const response = await fetch(apiUrl, {
          method: "POST",
          mode: "cors",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedHero) // Send the selected hero as JSON
      });

      // Process the PDF response
      const pdfBlob = await response.blob();

      // Create a download link for the PDF
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = `${selectedHero.name.replace(/\s+/g, "_")}_HeroSheet.pdf`;

      // Trigger the download
      downloadLink.click();

      // Clean up the URL object after download
      URL.revokeObjectURL(downloadLink.href);

});


const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let heroId = params.heroid;

if (heroId) { 
    selectElement("heroSelect", heroId);
    hero = heroes.find(hero => hero.id == heroId);
    renderHeroView(hero);
}

function selectElement(id, valueToSelect) {
  let element = document.getElementById(id);
  element.value = valueToSelect;
}

/**
 * drawdown.js
 * (c) Adam Leggett
 */


; function markdown(src) {

  var rx_lt = /</g;
  var rx_gt = />/g;
  var rx_space = /\t|\r|\uf8ff/g;
  var rx_escape = /\\([\\\|`*_{}\[\]()#+\-~])/g;
  var rx_hr = /^([*\-=_] *){3,}$/gm;
  var rx_blockquote = /\n *&gt; *([^]*?)(?=(\n|$){2})/g;
  var rx_list = /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g;
  var rx_listjoin = /<\/(ol|ul)>\n\n<\1>/g;
  var rx_highlight = /(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g;
  var rx_code = /\n((```|~~~).*\n?([^]*?)\n?\2|((    .*?\n)+))/g;
  var rx_link = /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g;
  var rx_table = /\n(( *\|.*?\| *\n)+)/g;
  var rx_thead = /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/;
  var rx_row = /.*\n/g;
  var rx_cell = /\||(.*?[^\\])\|/g;
  var rx_heading = /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g;
  var rx_para = /(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g;
  var rx_stash = /-\d+\uf8ff/g;

  function replace(rex, fn) {
    src = src.replace(rex, fn);
  }

  function element(tag, content) {
    return '<' + tag + '>' + content + '</' + tag + '>';
  }

  function blockquote(src) {
    return src.replace(rx_blockquote, function (all, content) {
      return element('blockquote', blockquote(highlight(content.replace(/^ *&gt; */gm, ''))));
    });
  }

  function list(src) {
    return src.replace(rx_list, function (all, ind, ol, num, low, content) {
      var entry = element('li', highlight(content.split(
        RegExp('\n ?' + ind + '(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +', 'g')).map(list).join('</li><li>')));

      return '\n' + (ol
        ? '<ol start="' + (num
          ? ol + '">'
          : parseInt(ol, 36) - 9 + '" style="list-style-type:' + (low ? 'low' : 'upp') + 'er-alpha">') + entry + '</ol>'
        : element('ul', entry));
    });
  }

  function highlight(src) {
    return src.replace(rx_highlight, function (all, _, p1, emp, sub, sup, small, big, p2, content) {
      return _ + element(
        emp ? (p2 ? 'strong' : 'em')
          : sub ? (p2 ? 's' : 'sub')
            : sup ? 'sup'
              : small ? 'small'
                : big ? 'big'
                  : 'code',
        highlight(content));
    });
  }

  function unesc(str) {
    return str.replace(rx_escape, '$1');
  }

  var stash = [];
  var si = 0;

  src = '\n' + src + '\n';

  replace(rx_lt, '&lt;');
  replace(rx_gt, '&gt;');
  replace(rx_space, '  ');

  // blockquote
  src = blockquote(src);

  // horizontal rule
  replace(rx_hr, '<hr/>');

  // list
  src = list(src);
  replace(rx_listjoin, '');

  // code
  replace(rx_code, function (all, p1, p2, p3, p4) {
    stash[--si] = element('pre', element('code', p3 || p4.replace(/^    /gm, '')));
    return si + '\uf8ff';
  });

  // link or image
  replace(rx_link, function (all, p1, p2, p3, p4, p5, p6) {
    stash[--si] = p4
      ? p2
        ? '<img src="' + p4 + '" alt="' + p3 + '"/>'
        : '<a href="' + p4 + '">' + unesc(highlight(p3)) + '</a>'
      : p6;
    return si + '\uf8ff';
  });

  // table
  replace(rx_table, function (all, table) {
    var sep = table.match(rx_thead)[1];
    return '\n' + element('table',
      table.replace(rx_row, function (row, ri) {
        return row == sep ? '' : element('tr', row.replace(rx_cell, function (all, cell, ci) {
          return ci ? element(sep && !ri ? 'th' : 'td', unesc(highlight(cell || ''))) : ''
        }))
      })
    )
  });

  // heading
  replace(rx_heading, function (all, _, p1, p2) { return _ + element('h' + p1.length, unesc(highlight(p2))) });

  // paragraph
  replace(rx_para, function (all, content) { return element('p', unesc(highlight(content))) });

  // stash
  replace(rx_stash, function (all) { return stash[parseInt(all)] });

  return src.trim();
};