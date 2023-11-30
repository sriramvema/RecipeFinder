const form = document.querySelector("form");
const ingredientsInput = document.querySelector("#ingredients");
const resultsList = document.querySelector("#results-list");
const ingredientsList = document.querySelector("#ingredients-list");
const instructionsList = document.querySelector("#instructions-list");
const recipeDetails = document.querySelector("#recipe-details");

// Add a form submission event listener
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const ingredients = ingredientsInput.value.trim();
    if (ingredients === "") {
        alert("Please enter ingredients.");
        return;
    }

    // Make an AJAX request to the Flask route for recipe search
    fetch("/", {
        method: "POST",
        body: new URLSearchParams({ ingredients }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    .then((response) => response.json())
    .then((data) => {
        // Clear previous search results
        resultsList.innerHTML = "";
        recipeDetails.style.display = "none"; // Hide recipe details

        // Display new search results
        data.recipes.forEach((recipe) => {
            const listItem = document.createElement("li");
            listItem.dataset.recipeId = recipe.id; // Store recipe ID
            listItem.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>${recipe.summary}</p>
                <a href="${recipe.sourceUrl}" target="_blank">Read More</a>
            `;
            resultsList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error("Error fetching recipes:", error);
        alert("Failed to fetch recipes. Please try again later.");
    });
});

// Add a click event listener to each recipe item
resultsList.addEventListener("click", (event) => {
    const listItem = event.target.closest("li");
    if (!listItem) return;
    const recipeId = listItem.dataset.recipeId;

    // Make an API request to get detailed recipe information by ID
    fetch(`/recipe/${recipeId}`)
        .then((response) => response.json())
        .then((data) => {
            // Display ingredients and instructions for the selected recipe
            displayRecipeDetails(data);
        })
        .catch((error) => {
            console.error("Error fetching recipe details:", error);
            alert("Failed to fetch recipe details. Please try again later.");
        });
});

// Function to display ingredients and instructions for a recipe
function displayRecipeDetails(recipe) {
    ingredientsList.innerHTML = ""; // Clear previous ingredients
    instructionsList.innerHTML = ""; // Clear previous instructions

    // Populate ingredients
    recipe.ingredients.forEach((ingredient) => {
        const listItem = document.createElement("li");
        listItem.textContent = ingredient;
        ingredientsList.appendChild(listItem);
    });

    // Populate instructions
    recipe.instructions.forEach((instruction) => {
        const listItem = document.createElement("li");
        listItem.textContent = instruction;
        instructionsList.appendChild(listItem);
    });

    recipeDetails.style.display = "block"; // Show recipe details
}