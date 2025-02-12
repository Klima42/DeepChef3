// netlify/functions/process-request.js
exports.handler = async function (event) {
  try {
    const { imageFile, messages, currentMessage } = JSON.parse(event.body);
    const spoonacularKey = process.env.SPOONACULAR_API_KEY;
    
    if (!spoonacularKey) {
      throw new Error("Spoonacular API key is not configured");
    }

    let ingredients = [];

    // Handle text input
    if (currentMessage) {
      const text = currentMessage.toLowerCase();
      // Split text into words and clean up
      const words = text.split(/[,\s]+/).map(word => word.trim());
      ingredients = words.filter(word => word.length > 2);
      console.log("Ingredients from text:", ingredients);
    }
    // Handle image input
    else if (imageFile) {
      try {
        const moondreamKey = process.env.MOONDREAM_API_KEY;
        if (!moondreamKey) {
          throw new Error("Moondream API key is not configured");
        }

        const moondreamResponse = await fetch("https://api.moondream.ai/v1/caption", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Moondream-Auth": moondreamKey,
          },
          body: JSON.stringify({
            image_url: `data:image/jpeg;base64,${imageFile}`,
            stream: false,
          }),
        });

        if (!moondreamResponse.ok) {
          const errorData = await moondreamResponse.text();
          console.error("Moondream API error response:", errorData);
          throw new Error(`Moondream API failed with status ${moondreamResponse.status}`);
        }

        const moondreamData = await moondreamResponse.json();
        if (!moondreamData.caption) {
          throw new Error("No caption received from Moondream API");
        }

        // Extract potential ingredients from the caption
        const caption = moondreamData.caption.toLowerCase();
        console.log("Moondream caption:", caption);

        // Expanded list of common food words and categories
        const commonFoodWords = [
          // Vegetables
          'tomato', 'potato', 'carrot', 'onion', 'garlic', 'pepper', 'lettuce', 'cucumber',
          'spinach', 'broccoli', 'cauliflower', 'zucchini', 'eggplant', 'mushroom', 'celery',
          'asparagus', 'pea', 'corn', 'bean',
          
          // Fruits
          'apple', 'banana', 'orange', 'lemon', 'lime', 'grape', 'strawberry', 'blueberry',
          'raspberry', 'blackberry', 'pineapple', 'mango', 'peach', 'pear', 'plum', 'cherry',
          
          // Proteins
          'chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'egg', 'tofu',
          'meat', 'steak', 'turkey', 'lamb', 'sausage',
          
          // Grains & Starches
          'rice', 'pasta', 'bread', 'noodle', 'quinoa', 'couscous', 'flour', 'oat',
          'cereal', 'tortilla', 'bagel',
          
          // Dairy & Alternatives
          'cheese', 'milk', 'yogurt', 'cream', 'butter', 'sour', 'cheddar', 'mozzarella',
          
          // Condiments & Seasonings
          'salt', 'pepper', 'oil', 'vinegar', 'sauce', 'mayonnaise', 'mustard', 'ketchup',
          'spice', 'herb', 'seasoning',
          
          // Prepared Foods
          'soup', 'salad', 'sandwich', 'pizza', 'burger', 'fry', 'roll', 'cake',
          'cookie', 'pie', 'dish', 'meal'
        ];

        // Common food-related adjectives
        const foodAdjectives = [
          'fresh', 'raw', 'cooked', 'baked', 'fried', 'grilled', 'roasted', 'steamed',
          'chopped', 'sliced', 'diced', 'whole', 'ripe', 'green', 'red', 'yellow'
        ];

        // Split caption into words and clean them
        const words = caption
          .replace(/[.,!?]/g, '') // Remove punctuation
          .split(/[\s,]+/)
          .map(word => word.trim())
          .filter(word => word.length > 2);

        // Extract ingredients using expanded criteria
        ingredients = words.filter(word => {
          // Remove common stop words
          if (['the', 'and', 'with', 'for', 'that', 'this', 'are', 'there', 'some', 'from'].includes(word)) {
            return false;
          }

          // Check if word is a food item or ends with 's' and its singular form is a food item
          const singular = word.endsWith('s') ? word.slice(0, -1) : word;
          const isCommonFood = commonFoodWords.includes(word) || commonFoodWords.includes(singular);
          
          // Don't include just adjectives
          const isOnlyAdjective = foodAdjectives.includes(word) && !isCommonFood;

          return isCommonFood && !isOnlyAdjective;
        });

        // Remove duplicates
        ingredients = [...new Set(ingredients)];

        console.log("Extracted ingredients:", ingredients);
      } catch (error) {
        console.error("Moondream analysis error:", error);
        throw new Error(`Image analysis failed: ${error.message}`);
      }
    }

    // Get recipe suggestions if we have ingredients
    if (ingredients.length > 0) {
      try {
        const ingredientsString = encodeURIComponent(ingredients.join(','));
        const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsString}&number=3&ranking=2&ignorePantry=true&apiKey=${spoonacularKey}`;
        
        console.log("Calling Spoonacular API...");
        const recipeResponse = await fetch(spoonacularUrl);

        if (!recipeResponse.ok) {
          const errorData = await recipeResponse.text();
          console.error("Spoonacular API error response:", errorData);
          throw new Error(`Spoonacular API failed with status ${recipeResponse.status}`);
        }

        const recipes = await recipeResponse.json();
        console.log("Recipes received:", recipes.length);

        return {
          statusCode: 200,
          body: JSON.stringify({
            ingredients,
            recipes: recipes.map(recipe => ({
              id: recipe.id,
              title: recipe.title,
              missedIngredientCount: recipe.missedIngredientCount,
              usedIngredientCount: recipe.usedIngredientCount,
              image: recipe.image
            }))
          })
        };
      } catch (error) {
        console.error("Spoonacular API error:", error);
        throw new Error(`Recipe fetch failed: ${error.message}`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ingredients: [],
        recipes: []
      })
    };

  } catch (error) {
    console.error("Process request error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process request",
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};