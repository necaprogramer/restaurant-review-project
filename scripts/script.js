import { API_URL, BEARER_TOKEN } from './api-config.js';

const RESTAURANTS_PER_SCROLL = 15;
const LIMIT_OF_FETCHED_RESTAURANTS = 50;

/* Limit was set to 50, to lower the number of requests sent to YELP API, since we are limited to only about 5000 requests per day. So, hypothetically only a small number of users could use up this number of requests */

let arrayOfRestaurants = [];
let pageScrolledCounter = 1;
let totalRestaurants = 0;

let allCategoriesArray = [];
let restaurantCategories = [];

let containerDiv = document.getElementById('container');

let categoriesList = document.getElementById('category-list');

let loader = document.getElementById('loader');
hideLoader();

let footer = document.querySelector('footer');
let endOfResults = document.createElement('div');
endOfResults.innerText = `Seems like they don't have 'em chief. Maybe try with a different category?`
let backToTopButton = document.createElement('button');
backToTopButton.onclick = toTop();
backToTopButton.innerHTML = `<i class="fa-solid fa-jet-fighter-up"></i>`;
footer.appendChild(endOfResults);
footer.appendChild(backToTopButton);
hideFooterContents();

function createCategoryButtons(array){
    for(let i = 0; i < array.length; i++){
        let categoryList = document.createElement('li')
        let categoryButton = document.createElement('button');

        categoriesList.appendChild(categoryList);
        categoryList.appendChild(categoryButton);

        categoryList.setAttribute('class', 'category-list-item');
        categoryButton.classList.add('category-button');
        categoryButton.setAttribute('id', `${array[i].alias}`);
        categoryButton.innerText = `${array[i].title}`;

        ifClicked(categoryButton, array[i].alias);
    }
}

async function ifClicked(categoryButton, categoryId){
    categoryButton.addEventListener('click', async () => {
        resetRestaurantCards();
        await getRequest(categoryId, offsetOfFetchedRestaurants, LIMIT_OF_FETCHED_RESTAURANTS);
        /* 
        Since we are getting 50 restaurants and putting that in arrayOfRestaurants variable, we need to slice 15 restaurants from this array, which will be displayed & we put them in their own array
        */
        elementsOnPage = arrayOfRestaurants.slice(0, RESTAURANTS_PER_SCROLL);
        createRestaurantCardsFromArray(elementsOnPage);
        totalShownRestaurants += RESTAURANTS_PER_SCROLL;
        infiniteScroll(categoryId);
    })
}

getCategories();

async function getCategories(){
    try {
        const res = await fetch('../resources/categories.json');
        const json = await res.json();
        allCategoriesArray = json;
        allCategoriesArray.map(el => {
            for(let i = 0; i < el.parents.length; i++){
                if(el.parents[i] == 'restaurants'){
                    restaurantCategories.push(el);
                }
            }
        });
        createCategoryButtons(restaurantCategories);
    } catch (error) {
        console.log(error)
    }
}

let offsetOfFetchedRestaurants = 0;
let totalShownRestaurants = 0;
let elementsOnPage = 0;

function createRestaurantCardsFromArray(array) {
    for (let i = 0; i < array.length; i++) {
        createRestaurantCard(array[i].name, array[i].image_url, array[i].rating, array[i].price, array[i].url);
    }
}

function infiniteScroll(category) {
        window.addEventListener('scroll', () => {
            if (document.documentElement.scrollHeight === window.pageYOffset + window.innerHeight) {
                showLoader();
                setTimeout(() => {
                    if (totalShownRestaurants <= totalRestaurants) {
                        let startingScrollIndex = RESTAURANTS_PER_SCROLL * pageScrolledCounter;
                        /* We get the next 15 elements of the arrayOfRestaurants variable */
                        elementsOnPage = arrayOfRestaurants.slice(startingScrollIndex, startingScrollIndex + RESTAURANTS_PER_SCROLL);
                        createRestaurantCardsFromArray(elementsOnPage);
                        totalShownRestaurants += RESTAURANTS_PER_SCROLL;
                        /* If we have used up restaurants in the arrayOfRestaurants variable, send a new request and get next 50 restaurants */
                        if ((arrayOfRestaurants.length - startingScrollIndex) < RESTAURANTS_PER_SCROLL) {
                            getRequest(category, startingScrollIndex, LIMIT_OF_FETCHED_RESTAURANTS);
                        }
                    }else if(totalShownRestaurants >= totalRestaurants){
                        hideLoader();
                        endOfResults.innerText = `That's all of 'em chief.`;
                        showFooterContents();
                    }
                    hideLoader();
                    pageScrolledCounter++;
                }, 500)
            }
    });
}

async function getRequest(category, offset, limit) {
    try {
        const res = await axios.get(API_URL + `&categories=${category}&offset=${offset}&limit=${limit}`, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
        arrayOfRestaurants.push(...res.data.businesses);
        totalRestaurants = res.data.total;
        if(totalRestaurants == 0){
            endOfResults.innerText = `There aren't any of 'em chief. Maybe try with a different category?`;
        }
    }
    catch (e) {
        console.log(e);
    }
}

function createRestaurantCard(restaurantName, restaurantImage, restaurantRating, restaurantPrice, restaurantLink) {
    var restaurantDiv = document.createElement('div');
    containerDiv.appendChild(restaurantDiv);
    restaurantDiv.classList.add('restaurant-container');

    let image = document.createElement('div');
    restaurantDiv.appendChild(image);
    if(restaurantImage === ''){
        image.setAttribute('style', `background-image: url('../resources/img/generic-restaurant-image.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        height: 10rem;`);
    }else{
        image.setAttribute('style', `background-image: url(${restaurantImage});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        height: 10rem;`);
    }

    let name = document.createElement('h3');
    restaurantDiv.appendChild(name);
    name.innerText = restaurantName;

    let ratingAndPrice = document.createElement('div');
    restaurantDiv.appendChild(ratingAndPrice);
    ratingAndPrice.classList.add('restaurant-rating-and-price');

    let rating = document.createElement('div');
    let price = document.createElement('div');

    ratingAndPrice.appendChild(rating);
    rating.classList.add('rating');
    for(let i = 0; i <= 5; i++){
        let star = document.createElement('div');
        rating.appendChild(star);
        if(restaurantRating === undefined){
            star.classList.add('review-star-empty');
        }else if(restaurantRating < i){
            if(restaurantRating - i == -0.5){
                star.classList.remove('review-star-full');
            }else{
                star.classList.add('review-star-empty');
        }}else if(restaurantRating > i){
            if(restaurantRating - i == 0.5){
                star.classList.add('review-star-half');
            }else{
                star.classList.add('review-star-full');
            }
        }
    }

    ratingAndPrice.appendChild(price);
    price.classList.add('pricing');
    if(restaurantPrice === undefined){
        price.innerText = 'No pricing :('
    }else{
        price.innerText = restaurantPrice;
    }

    let button = document.createElement('button');
    restaurantDiv.appendChild(button);
    button.setAttribute('class', 'restaurant-website-button');
    let link = document.createElement('a');
    button.appendChild(link);
    link.setAttribute('href', restaurantLink);
    link.innerText = 'View';
}


//#region helper methods
function resetRestaurantCards(){
    arrayOfRestaurants = [];
    pageScrolledCounter = 1;
    totalRestaurants = 0;
    totalShownRestaurants = 0;
    offsetOfFetchedRestaurants = 0;
    elementsOnPage = 0;
    let restaurants = document.querySelectorAll('.restaurant-container');
    restaurants.forEach(restaurant => {
        containerDiv.removeChild(restaurant);
    });
    hideFooterContents();
}

function hideLoader() {
    loader.classList.remove('show');
    loader.classList.add('hide');
}

function showLoader() {
    loader.classList.remove('hide');
    loader.classList.add('show');
}

function hideFooterContents(){
    endOfResults.classList.remove('show');
    endOfResults.classList.add('hide');
    backToTopButton.classList.remove('show');
    backToTopButton.classList.add('hide');
}

function showFooterContents(){
    endOfResults.classList.remove('hide');
    endOfResults.classList.add('show');
    backToTopButton.classList.remove('hide');
    backToTopButton.classList.add('show');
}

function toTop(){
    window.scroll({top: 0, behavior: 'smooth'});
}
//#endregion