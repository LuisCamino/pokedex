const pokedex$$ = document.getElementById("pokedex");
const ALL_POKEMONS = []; 
const TYPES = ["all"];

const getAllPokemons = () => {
  return fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((error) => console.log("Error obteniendo todos los pokemons", error));
};

const getIndividualPokemon = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((response) => {
     
      const pokemon = {
        name: response.name,
        id: response.id,
        type: response.types.map((type) => type.type.name),
        image: response.sprites.versions["generation-v"]["black-white"].animated.front_default,
        ability: response.abilities[0].ability.name,
        height: response.height,
        weight: response.weight
      };
      pokemon.type.forEach((type) => {
        if (!TYPES.includes(type)) {
          TYPES.push(type);
        }
      });

      return pokemon;
    })
    .catch((error) => console.log("Error obteniendo todos los pokemons", error));
};

const drawPokemons = (pokemons) => {

  pokedex$$.innerHTML = "";

  pokemons.forEach((poke) => {

    const li = document.createElement("li");

    const html = `
    <div class="flip-card" tabIndex="0">
    <div class="flip-card-inner">
      <div class="flip-card-front">
            <img src=${poke.image} alt=${poke.name}>
            <p>${poke.name}</p>
            <p>#${poke.id}</p>
            </div>

            <div class="flip-card-back">
            <p class="pnumber"><b>number: </b> ${poke.id}</p>
            <p><b>name</b>: ${poke.name}<p>
            <p><b>type: </b> ${poke.type[0]} ${poke.type[1] ? `, ${poke.type[1]}` : ""}</p>
            <p><b>main ability: </b> ${poke.ability}</p>
            <p><b>height: </b> ${poke.height} cm</p>
            <p><b>weight: </b> ${poke.weight} kg's</p>
        </div>
      </div>
    </div>
            
        `;
    li.innerHTML = html;
    pokedex$$.appendChild(li);
  });
};

const filter = (event) => {

  const inputValue = event.target.value.toLowerCase();
  const filtered = ALL_POKEMONS.filter((pokemon) => {
    const matchName = pokemon.name.toLowerCase().includes(inputValue);
    const matchId = pokemon.id === Number(inputValue);

    return matchName || matchId;
  });

  drawPokemons(filtered);
};

const addAllMyEventsListeners = () => {
  document.getElementById("input-search").addEventListener("input", filter);
};

const filterByType = (event) => {
 
  const typeToFilter = event.target.classList[0]; 

  if (typeToFilter === "all") {

    return drawPokemons(ALL_POKEMONS);
  }

  const filtered = ALL_POKEMONS.filter((pokemon) => {
    const matchType = pokemon.type.includes(typeToFilter);
    return matchType;
  });

  drawPokemons(filtered);
};

const drawTypesButtons = () => {
  const typesContainer$$ = document.querySelector(".types");

  TYPES.forEach((type) => {
    const span = document.createElement("span");
    span.classList.add(type);
    span.addEventListener("click", filterByType);
    span.innerText = type;
    typesContainer$$.appendChild(span);
  });
};

const startMyCode = async () => {
  addAllMyEventsListeners();

  const allPokemons = await getAllPokemons();

  for (const pokemon of allPokemons) {
    const pokemonInfo = await getIndividualPokemon(pokemon.url);
    ALL_POKEMONS.push(pokemonInfo);
  }

  drawTypesButtons();
  drawPokemons(ALL_POKEMONS);
};

startMyCode();

