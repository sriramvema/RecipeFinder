from flask import Flask, render_template, request, flash, redirect, url_for
import requests
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with your own secret key

# Your Spoonacular API key (replace with your actual API key)
SPOONACULAR_API_KEY = "73a16eb024304d5b81014ffc843b376a"

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        ingredients = request.form.get("ingredients")
        if not ingredients:
            flash("Please enter ingredients.", "danger")
            return redirect(url_for("index"))
        recipes = get_recipes(ingredients)
        if recipes is None:
            flash("Failed to fetch recipes. Please try again later.", "danger")
            return redirect(url_for("index"))
        return render_template("results.html", recipes=recipes)
    return render_template("index.html")

def get_recipes(ingredients):
    try:
        url = "https://api.spoonacular.com/recipes/findByIngredients"
        params = {
            "ingredients": ingredients,
            "apiKey": SPOONACULAR_API_KEY,
            "number": 5  # Number of recipes to fetch
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        recipes = response.json()
        return recipes
    except requests.exceptions.RequestException as e:
        # Handle API request errors
        print(f"API Request Error: {str(e)}")
        return None

if __name__ == "__main__":
    app.run(debug=True)