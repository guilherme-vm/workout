$(document).ready(function () {
    // Load saved points from Local Storage when the page loads
    loadSavedPoints();

    // Save points to Local Storage when the Save button is clicked
    $("#saveEditPoints").on('click', function () {
        savePointsToLocalStorage();
    });

    // Function to save points to Local Storage
    function savePointsToLocalStorage() {
        const points = {
            swimming: $("#swimmingEditPoints").val(),
            gym: $("#gymEditPoints").val(),
            fastFood: $("#fastFoodEditPoints").val(),
            tobacco: $("#tobaccoEditPoints").val(),
            water: $("#waterEditPoints").val(),
            salads: $("#saladsEditPoints").val(),
            alcohol: $("#alcoholEditPoints").val(),
            stretches: $("#stretchesEditPoints").val()
        };

        // Save the points object to Local Storage
        localStorage.setItem('points', JSON.stringify(points));

        alert("Points saved!");
    }

    // Function to load points from Local Storage and populate the inputs
    function loadSavedPoints() {
        const savedPoints = JSON.parse(localStorage.getItem('points'));

        if (savedPoints) {
            // Populate the input fields with saved values
            $("#swimmingEditPoints").val(savedPoints.swimming || '');
            $("#gymEditPoints").val(savedPoints.gym || '');
            $("#fastFoodEditPoints").val(savedPoints.fastFood || '');
            $("#tobaccoEditPoints").val(savedPoints.tobacco || '');
            $("#waterEditPoints").val(savedPoints.water || '');
            $("#saladsEditPoints").val(savedPoints.salads || '');
            $("#alcoholEditPoints").val(savedPoints.alcohol || '');
            $("#stretchesEditPoints").val(savedPoints.stretches || '');
        }
    }

    // Load the current points from Local Storage
    let currentPoints = parseInt(localStorage.getItem('currentPoints')) || 0;
    $("#currentPoints").text(currentPoints);

    $("#settingsButton").on('click', function () {
        $(".homepage").fadeOut();
        $(".settingsPage").fadeIn();
    });

    $("#backArrow").on('click', function () {
        $(".homepage").fadeIn();
        $(".settingsPage").fadeOut();
    });

    $("#cancel").on('click', function () {
        $(".clickCategoryScreen").fadeOut();
    });

    $("#cancelSmoke").on('click', function () {
        $(".clickCategoryScreenSmoke").fadeOut();
    });

    var selectedCategory = "";

    $(".category").on('click', function () {
        // Get the text inside the clicked button's <p> tag
        var categoryName = $(this).find(".buttonLabel").text();

        // Update the #categoryTitle text with the category name
        $("#categoryTitle").text(categoryName);

        selectedCategory = categoryName;


        if (selectedCategory === 'Tobacco') {
            // Show the overlay
            $(".clickCategoryScreenSmoke").fadeIn();

        } else {
            // Show the overlay
            $(".clickCategoryScreen").fadeIn();
        }





    });

    $("#accept").on('click', function () {
        // Get the current points from #currentPoints (default to 0 if empty or invalid)
        currentPoints = parseInt($("#currentPoints").text()) || 0;

        // Get the value of the input based on the selected category
        let pointsToChange = parseInt($("#swimmingEditPoints").val()) || 0; // Default value if empty

        // Feedback message and color initialization
        let feedbackText = "";
        let feedbackColor = "";

        // Depending on the selected category, grab the corresponding points input value
        if (selectedCategory === 'Swimming') {
            pointsToChange = parseInt($("#swimmingEditPoints").val()) || 0;
        } else if (selectedCategory === 'Gym') {
            pointsToChange = parseInt($("#gymEditPoints").val()) || 0;
        } else if (selectedCategory === 'Fast Food') {
            pointsToChange = parseInt($("#fastFoodEditPoints").val()) || 0;
            // Subtract points for "Fast Food"
            currentPoints -= pointsToChange;
            feedbackText = `-${pointsToChange} points`;
            feedbackColor = "red"; // Red for subtraction
        } else if (selectedCategory === 'Water') {
            pointsToChange = parseInt($("#waterEditPoints").val()) || 0;
        } else if (selectedCategory === 'Stretches') {
            pointsToChange = parseInt($("#stretchesEditPoints").val()) || 0;
        }else if (selectedCategory === 'Salads') {
            pointsToChange = parseInt($("#saladsEditPoints").val()) || 0;
        } else if (selectedCategory === 'Alcohol') {
            pointsToChange = parseInt($("#alcoholEditPoints").val()) || 0;
            // Subtract points for "Alcohol"
            currentPoints -= pointsToChange;
            feedbackText = `-${pointsToChange}`;
            feedbackColor = "#B21D1D"; // Red for subtraction
        }

        // If the category is not subtracting points, add them
        if (selectedCategory !== 'Fast Food' && selectedCategory !== 'Tobacco' && selectedCategory !== 'Alcohol') {
            currentPoints += pointsToChange;
            feedbackText = `+${pointsToChange}`;
            feedbackColor = "#3DB149"; // Green for addition
        }

        // Update the current points display
        $("#currentPoints").text(currentPoints);

        // Save the updated total points to Local Storage
        localStorage.setItem('currentPoints', currentPoints);

        // Show feedback with the appropriate color
        $("#feedbackPoints").text(feedbackText).css("color", feedbackColor).fadeIn();

        // Hide the feedback after 2 seconds
        setTimeout(function () {
            $("#feedbackPoints").fadeOut();
        }, 2000);

        // Hide the overlay after accepting
        $(".clickCategoryScreen").fadeOut();
    });

});




var cigarettesSelected = 0; // Variable to store the number of cigarettes selected

// When a cigarette button is clicked, store the number of cigarettes selected
$(".numberCigarettes").on('click', function () {
    // Remove the active class from all buttons
    $(".numberCigarettes").removeClass("cigarreteButtonActive");
    // Add the active class to the clicked button
    $(this).addClass("cigarreteButtonActive");
    // Store the number of cigarettes selected
    cigarettesSelected = parseInt($(this).text()); // Get the number from the button text
    
     
});

// When the "Accept" button is clicked
$("#acceptSmoke").on('click', function () {
    $(".numberCigarettes").removeClass("cigarreteButtonActive");
    

    currentPoints = parseInt($("#currentPoints").text()) || 0;
    // Retrieve saved points from Local Storage
    let savedPoints = JSON.parse(localStorage.getItem('points')) || {};
    // Get the tobacco points (default to 0 if not set)
    let tobaccoPoints = parseInt(savedPoints.tobacco) || 0;
    var pointsToLoseSmoke = cigarettesSelected * tobaccoPoints;

    // Subtract points for "Alcohol"
    currentPoints -= pointsToLoseSmoke;
    feedbackText = `-${pointsToLoseSmoke}`;
    feedbackColor = "#B21D1D"; // Red for subtraction



    $("#currentPoints").text(currentPoints);

    // Save the updated total points to Local Storage
    localStorage.setItem('currentPoints', currentPoints);

    // Show feedback with the appropriate color
    $("#feedbackPoints").text(feedbackText).css("color", feedbackColor).fadeIn();

    // Hide the feedback after 2 seconds
    setTimeout(function () {
        $("#feedbackPoints").fadeOut();
    }, 2000);

    // Hide the overlay after accepting
    $(".clickCategoryScreenSmoke").fadeOut();

});