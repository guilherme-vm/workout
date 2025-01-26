// When ready... HIDE SEARCHBAR
window.addEventListener("load",function() {
	// Set a timeout...
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(0, 1);
	}, 0);
});

$(document).ready(function () {
    const savePointsToLocalStorage = () => {
        const points = {
            swimming: $("#swimmingEditPoints").val(),
            gym: $("#gymEditPoints").val(),
            fastfood: $("#fastfoodEditPoints").val(),
            tobacco: $("#tobaccoEditPoints").val(),
            water: $("#waterEditPoints").val(),
            salads: $("#saladsEditPoints").val(),
            alcohol: $("#alcoholEditPoints").val(),
            stretches: $("#stretchesEditPoints").val(),
        };
        localStorage.setItem("points", JSON.stringify(points));
        // alert("Points saved!");


        $(".feedback").fadeIn();

        setTimeout(function(){
            // Hide the address bar!
            $(".feedback").fadeOut();
        }, 2000);




    };


    // ———————————————————————————————————————————————— Refresh

    $("#refreshButton").on('click', function(){
        window.location.reload();
    })


    const loadSavedPoints = () => {

        const savedPoints = JSON.parse(localStorage.getItem("points")) || {};
        Object.entries(savedPoints).forEach(([key, value]) => {
            $(`#${key}EditPoints`).val(value || "");
        });
    };

    const updatePointsDisplay = (points) => {
        $("#currentPoints, #currentPointsCoupons").text(points);
        localStorage.setItem("currentPoints", points);

    };

    let currentPoints = parseInt(localStorage.getItem("currentPoints")) || 0;
    
    updatePointsDisplay(currentPoints);

    loadSavedPoints();

    $("#saveEditPoints").on("click", savePointsToLocalStorage);

    const toggleScreens = (show, hide) => {
        $(hide).fadeOut();
        $(show).fadeIn();
    };

    $("#settingsButton").on("click", () => toggleScreens(".settingsPage", ".homepage"));

    // $(".backArrow").on("click", () => toggleScreens(".homepage", ".settingsPage"));

    $(".backArrow").on("click", function(){
        $(".homepage").fadeIn();
        $(".settingsPage").fadeOut();
        $(".couponsScreen").fadeOut();
        
    });




    $(".cancelButton").on("click", () => $(".overlayPopUp").fadeOut());

    let selectedCategory = "";
    let selectedCoupon = null;
    let selectedCoupon2 = null;
    let cigarettesSelected = 0;

    $(".category").on("click", function () {
        selectedCategory = $(this).find(".buttonLabel").text();
        $("#categoryTitle").text(selectedCategory);
        selectedCategory === "Tobacco" ?
            $("#clickCategoryScreenSmoke").fadeIn() :
            $("#clickCategoryScreen").fadeIn();
    });





    $("#accept").on("click", function () {
        // Retrieve saved points from Local Storage
        let savedPoints = JSON.parse(localStorage.getItem("points")) || {};
        let pointsToChange = parseInt(savedPoints[selectedCategory.toLowerCase()]) || 0;


        let feedbackColor = "#3DB149";
        let feedbackText = `+${pointsToChange}`;

        // Categories that subtract points
        if (["Fastfood", "Alcohol", "Tobacco"].includes(selectedCategory)) {
            currentPoints -= pointsToChange;
            feedbackColor = "#B21D1D";
            feedbackText = `-${pointsToChange}`;


        } else {
            currentPoints += pointsToChange;
        }

        // Update points and display feedback
        updatePointsDisplay(currentPoints);
        $("#feedbackPoints").text(feedbackText).css("color", feedbackColor).fadeIn().delay(2000).fadeOut();

        $("#clickCategoryScreen").fadeOut();
    });





        // —————————————————————————————————————————————————————————————————————————————————————————— differenciate COUPONs
    function teste(element) {
        let couponsAll = JSON.parse(localStorage.getItem("couponsAll")) || []; // Retrieve couponsAll as an array
    
    
        let couponName = $(element).find(".couponName").text().trim(); // Get the coupon name
    
        // Find the object inside couponsAll with a matching name
        let couponIndex = couponsAll.findIndex(coupon => coupon.name === couponName);

    
        if (couponIndex !== -1) {
            // If the coupon is found, update its "owned" property
            if (couponsAll[couponIndex].owned === "no") {
                couponsAll[couponIndex].owned = "yes";
            } else if (couponsAll[couponIndex].owned === "yes") {
                couponsAll[couponIndex].owned = "no";
            }
            localStorage.setItem("couponsAll", JSON.stringify(couponsAll)); // Save back to localStorage
        } else {
            console.error("Coupon not found in couponsAll:", couponName);
        }
    }
    

$("#couponsButton").on('click', function(){
    $(".homepage").fadeOut();
    $(".couponsScreen").fadeIn();
    
})



    

    // —————————————————————————————————————————————————————————————————————————————————————————— BUY COUPON

    $(document).on("click", ".coupon", function () {
        if (!$(this).hasClass("coupon")) return;
        selectedCoupon = $(this);

        var selectedCouponParent = $(this).parent();
        $("#nameOfCoupon").text(selectedCoupon.find(".couponName").text().trim());
        $("#couponPurchasePoints").text(selectedCoupon.find(".couponPrice").text().trim());
        $("#clickCouponScreen").fadeIn();
    });

    $("#acceptCouponPurchase").on("click", function () {
        if (!selectedCoupon) return alert("No coupon selected!");
    
        // Get the coupon price to subtract from points
        let pointsToSubtract = parseInt(selectedCoupon.find(".couponPrice").text().trim());
        currentPoints -= pointsToSubtract;
        updatePointsDisplay(currentPoints);
    
        // Find the coupon in the localStorage "couponsAll" array
        let couponsAll = JSON.parse(localStorage.getItem("couponsAll")) || [];
        let couponName = selectedCoupon.find(".couponName").text().trim();
    
        // Find the coupon in couponsAll and update its "owned" property
        let couponIndex = couponsAll.findIndex(coupon => coupon.name === couponName);
        if (couponIndex !== -1) {
            // Remove the coupon from couponsAll before moving
            let removedCoupon = couponsAll.splice(couponIndex, 1)[0];
            
            // Save the updated couponsAll back to localStorage
            localStorage.setItem("couponsAll", JSON.stringify(couponsAll));
    
            // Mark coupon as owned
            removedCoupon.owned = "yes"; // Update the owned status
            removedCoupon.available = "yes"; // Ensure it's marked as available
    
            // Move coupon to couponsAvailable
            let couponsAvailable = JSON.parse(localStorage.getItem("couponsAvailable")) || [];
            couponsAvailable.push(removedCoupon);
    
            // Save couponsAvailable to localStorage
            localStorage.setItem("couponsAvailable", JSON.stringify(couponsAvailable));
        }
    
        // Now move the coupon to the UI
        selectedCoupon.removeClass("coupon").addClass("available");
        $(".availableCoupons").append(selectedCoupon.parent());
        selectedCoupon.parent().find(".deleteCoupon").hide();
    
        // Update coupon status
        teste(selectedCoupon);
    
        // Show the available coupons title if there are any
        $(".availableCouponsTitle").show();
    
        // Close the coupon purchase screen
        $("#clickCouponScreen").fadeOut();
        selectedCoupon = null;
    });
    


    // ———————————————————————————————————————————————————————————————————————————————————————————————— USE COUPONS


    $(document).on("click", ".available", function () {
        selectedCoupon2 = $(this);
        $("#categoryTitle, #nameOfUseCoupon").text(selectedCoupon2.find(".couponName").text());
        $("#clickCouponUseScreen").fadeIn();
    });
    




    $("#acceptCouponUse").on("click", function () {
        if (!selectedCoupon2) return alert("No coupon selected!");
    
        // Find the coupon in the localStorage "couponsAvailable" array
        let couponsAvailable = JSON.parse(localStorage.getItem("couponsAvailable")) || [];
        let couponName = selectedCoupon2.find(".couponName").text().trim();
    
        // Find the coupon in couponsAvailable and remove it from that array
        let couponIndex = couponsAvailable.findIndex(coupon => coupon.name === couponName);
        if (couponIndex !== -1) {
            // Remove the coupon from couponsAvailable before adding it to couponsAll
            let removedCoupon = couponsAvailable.splice(couponIndex, 1)[0];
    
            // Save the updated couponsAvailable back to localStorage
            localStorage.setItem("couponsAvailable", JSON.stringify(couponsAvailable));
    
            // Now move it back to couponsAll
            let couponsAll = JSON.parse(localStorage.getItem("couponsAll")) || [];
            removedCoupon.owned = "no"; // Mark as not owned when moved back
            removedCoupon.available = "yes"; // Ensure it's marked as available
    
            // Add the coupon back to couponsAll
            couponsAll.push(removedCoupon);
    
            // Save updated couponsAll to localStorage
            localStorage.setItem("couponsAll", JSON.stringify(couponsAll));
        }
    
        // Now move the coupon back to the UI
        selectedCoupon2.parent().find(".deleteCoupon").show();
        selectedCoupon2.find(".couponPrice").show();
        selectedCoupon2.removeClass("available").addClass("coupon");
        $(".couponStoreList").append(selectedCoupon2.parent());
    
        // Close the coupon use screen
        $("#clickCouponUseScreen").fadeOut();
        selectedCoupon2 = null;


         // Check if .availableCoupons is empty on page load
    if ($(".availableCoupons").children().length === 0) {
        $(".availableCouponsTitle").hide(); // Hide the title if there are no coupons
    }

    // Optionally, you can add an event listener or function to handle changes in the coupons list
    // For example, if coupons are added or removed dynamically
    $(".availableCoupons").on('DOMSubtreeModified', function() {
        if ($(".availableCoupons").children().length === 0) {
            $(".availableCouponsTitle").hide(); // Hide the title if there are no coupons
        } else {
            $(".availableCouponsTitle").show(); // Show the title if there are coupons
        }
    });
    });
    






    

    $(".numberCigarettes").on("click", function () {
        $(".numberCigarettes").removeClass("cigarreteButtonActive");
        $(this).addClass("cigarreteButtonActive");
        cigarettesSelected = parseInt($(this).text());
    });

    $("#acceptSmoke").on("click", function () {
        $(".numberCigarettes").removeClass("cigarreteButtonActive");
        let tobaccoPoints = parseInt(JSON.parse(localStorage.getItem("points"))?.tobacco ||0);
        let pointsToLoseSmoke = cigarettesSelected * tobaccoPoints;
        currentPoints -= pointsToLoseSmoke;

        $("#feedbackPoints").text(`-${pointsToLoseSmoke}`).css("color", "#B21D1D").fadeIn().delay(2000).fadeOut();
        updatePointsDisplay(currentPoints);
        $("#clickCategoryScreenSmoke").fadeOut();
    });




// ———————————————————————————————————————————————————————————————————————————————————————————————— LOAD COUPONS
const loadCoupons = () => {
    // Load "couponsAll" from localStorage for store coupons
    const savedStoreCoupons = JSON.parse(localStorage.getItem("couponsAll")) || [];
    let currentPoints = parseInt(localStorage.getItem("currentPoints")) || 0;

    // Clear the couponStoreList container
    $(".couponStoreList").empty();

    // Loop through "couponsAll" and append to the store list
    savedStoreCoupons.forEach(coupon => {
        let couponPricePoints = parseInt(coupon.price);

        // Determine if the coupon should be disabled based on current points
        const disableCoupon = couponPricePoints > currentPoints ? "couponDisabled" : "";

        // Coupon HTML for store
        const loadStoreCoupon = `
        <div class="couponSingle ${disableCoupon}">
            <div class="coupon">
                <img class="couponImage" src="assets/coupon.png" alt="">
                <p class="couponName">${coupon.name}</p>
                <p class="couponPrice">${coupon.price}</p>
            </div>
            <button class="deleteCoupon"><img src="assets/trash.png" alt=""></button>
        </div>
        `;

        // Append to the coupon store container
        $(".couponStoreList").append(loadStoreCoupon);
    });

    // Load "couponsAvailable" from localStorage for owned coupons
    const savedOwnedCoupons = JSON.parse(localStorage.getItem("couponsAvailable")) || [];

    // Clear the availableCoupons container
    $(".availableCoupons").empty();

    // Loop through "couponsAvailable" and append to the owned list
    savedOwnedCoupons.forEach(coupon => {
        // Coupon HTML for owned coupons
        const loadOwnedCoupon = `
        <div class="couponSingle">
            <div class="available">
                <img class="couponImage" src="assets/coupon.png" alt="">
                <p class="couponName">${coupon.name}</p>
                <p class="couponPrice" style="display: none;">${coupon.price}</p>
            </div>
            <button class="deleteCoupon" style="display: none;" ><img src="assets/trash.png" alt=""></button>
        </div>
        `;

        // Append to the available coupons container
        $(".availableCoupons").append(loadOwnedCoupon);
        $(".availableCouponsTitle").show();
    });
};

// Call loadCoupons on page load
loadCoupons();




// ———————————————————————————————————————————————————————————————————————————————————————————————— ADD COUPONS
$("#addCoupon").on("click", function () {

    $("#clickCouponAddScreen").fadeIn();


})



    // ———————————————————————————————————————————————————————————————————————————————————————————————— SAVE NEW COUPONS
    // Handle Save New Coupon Button Click
    // Handle Save New Coupon Button Click
$("#saveNewCoupon").on("click", function () {
    $("#clickCouponAddScreen").fadeOut();

    // Get values from the inputs
    const couponName = $("#newCouponName").val().trim();
    const couponPrice = $("#newCouponPrice").val().trim();

    // Validation: Ensure both name and price are filled in
    if (!couponName || !couponPrice) {
        alert("Please enter both a coupon name and price.");
        return;
    }

    // Create the coupon object
    const newCoupon = {
        name: couponName,
        price: couponPrice,
        available: "yes", // default value for available
        owned: "no", // default value for owned
    };

    // Check if "couponsAll" already exists in localStorage
    let coupons = JSON.parse(localStorage.getItem("couponsAll")) || [];

    // Add the new coupon to the array
    coupons.push(newCoupon);

    // Save the updated coupons array back to localStorage
    localStorage.setItem("couponsAll", JSON.stringify(coupons));

    // Optionally, you can alert or display a message when the coupon is saved
    // alert("New coupon saved!");

    // Create the coupon HTML element dynamically
    const newCouponElement = ` <div class="couponSingle">
        <div class="coupon">
            <img class="couponImage" src="assets/coupon.png" alt="">
            <p class="couponName">${couponName}</p>
            <p class="couponPrice">${couponPrice}</p>
        </div>
        <button class="deleteCoupon"><img src="assets/trash.png" alt=""></button>
        </div>
    `;

    // Append the new coupon element to the .couponStoreList
    $(".couponStoreList").append(newCouponElement);

    // Optionally reset the form
    $("#newCouponName").val("");
    $("#newCouponPrice").val("");
});


});







// ———————————————————————————————————————————————————————————————————————————————————————————————— DELETE COUPONS


$(document).on("click", ".deleteCoupon", function () {
    // Step 1: Find the parent div
    var parentDiv = $(this).closest("div");

    // Step 2: Get the coupon name from the parent div
    var couponName = parentDiv.find(".couponName").text().trim();

    // Step 3: Retrieve couponsAll from localStorage
    let couponsAll = JSON.parse(localStorage.getItem("couponsAll")) || [];

    // Step 4: Find the coupon in the array and remove it
    let updatedCoupons = couponsAll.filter(coupon => coupon.name !== couponName);

    // Step 5: Save the updated coupons array back to localStorage
    localStorage.setItem("couponsAll", JSON.stringify(updatedCoupons));

    // Step 6: Remove the parent div from the DOM
    parentDiv.remove();

    console.log(`Deleted coupon: ${couponName}`);
    console.log("Updated couponsAll:", updatedCoupons);
});
