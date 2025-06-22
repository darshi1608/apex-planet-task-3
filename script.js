const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipeList = document.getElementById("recipe-list");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.querySelector(".close");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query !== "") {
    fetchRecipes(query);
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function fetchRecipes(query) {
  recipeList.innerHTML = "<p>Loading recipes...</p>";
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    if (data.meals) {
      displayRecipes(data.meals);
    } else {
      recipeList.innerHTML = "<p>No recipes found. Try something else!</p>";
    }
  } catch (error) {
    recipeList.innerHTML = "<p>Failed to fetch recipes. Please try again later.</p>";
  }
}

function displayRecipes(recipes) {
  recipeList.innerHTML = "";
  recipes.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <p><strong>${meal.strArea}</strong> Dish</p>
      <p>Belongs to <strong>${meal.strCategory}</strong> Category</p>
      <button onclick="showModal(${JSON.stringify(meal).replace(/"/g, '&quot;')})">View Recipe</button>
    `;

    recipeList.appendChild(card);
  });
}

function showModal(meal) {
  modal.classList.remove("hidden");
  modalBody.innerHTML = `
    <h2 style="text-align:center; text-transform:uppercase;">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>
      ${getIngredients(meal)}
    </ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
  `;
}

function getIngredients(meal) {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<li>${measure} ${ingredient}</li>`;
    }
  }
  return ingredients;
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
