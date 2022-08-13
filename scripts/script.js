import { API_URL, BEARER_TOKEN } from './api-config.js';

const RESTAURANTS_PER_SCROLL = 15;
const LIMIT_OF_FETCHED_RESTAURANTS = 50;

let arrayOfRestaurants = [];
let pageScrolledCounter = 1;
let totalRestaurants = 0;

let containerDiv = document.getElementById('container');
let buttonBurgers = document.getElementById('burgers');
let buttonMexican = document.getElementById('mexican');
let buttonJapanese = document.getElementById('japanese');

let loader = document.getElementById('loader');
hideLoader();


let offsetOfFetchedRestaurants = 0;
let totalShownRestaurants = 0;
let elementsOnPage = 0;

buttonBurgers.addEventListener('click', async () => {
    await getRequest('burgers', offsetOfFetchedRestaurants, LIMIT_OF_FETCHED_RESTAURANTS);
    elementsOnPage = arrayOfRestaurants.slice(0, RESTAURANTS_PER_SCROLL);
    createRestaurantCardsFromArray(elementsOnPage);
    totalShownRestaurants += RESTAURANTS_PER_SCROLL;
    infiniteScroll('burgers');
});

buttonMexican.addEventListener('click', () => {
    getRequest('mexican');
});

buttonJapanese.addEventListener('click', () => {
    getRequest('japanese');
});

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
                        elementsOnPage = arrayOfRestaurants.slice(startingScrollIndex, startingScrollIndex + RESTAURANTS_PER_SCROLL);
                        createRestaurantCardsFromArray(elementsOnPage);
                        totalShownRestaurants += RESTAURANTS_PER_SCROLL;
                        if ((arrayOfRestaurants.length - startingScrollIndex) < RESTAURANTS_PER_SCROLL) {
                            getRequest(category, startingScrollIndex, LIMIT_OF_FETCHED_RESTAURANTS);
                        }
                    }
                    pageScrolledCounter++;
                    hideLoader();
                }, 500)
            }
    });
}

async function getRequest(category, offset, limit) {
    try {
        const res = await axios.get(API_URL + `&categories=${category}&offset=${offset}&limit=${limit}`, { headers: { Authorization: `Bearer ${BEARER_TOKEN}` } });
        arrayOfRestaurants.push(...res.data.businesses);
        totalRestaurants = res.data.total;
    }
    catch (e) {
        console.log(e);
    }
}

function createRestaurantCard(restaurantName, restaurantImage, restaurantRating, restaurantPrice, restaurantLink) {
    var restaurantDiv = document.createElement('div');
    containerDiv.appendChild(restaurantDiv);
    restaurantDiv.classList.add('restaurant-container');

    let name = document.createElement('h3');
    restaurantDiv.appendChild(name);
    name.innerText = restaurantName;

    let image = document.createElement('div');
    restaurantDiv.appendChild(image);
    image.setAttribute('style', `background-image: url(${restaurantImage});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 10em;`);


    let ratingAndPrice = document.createElement('div');
    restaurantDiv.appendChild(ratingAndPrice);
    ratingAndPrice.innerText = restaurantRating + restaurantPrice;

    let button = document.createElement('button');
    restaurantDiv.appendChild(button);
    let link = document.createElement('a');
    button.appendChild(link);
    link.setAttribute('href', restaurantLink);
    link.innerText = 'Link to restaurant website';
}

//#region helper methods
function debounce(func, timeout = 200) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function hideLoader() {
    loader.classList.remove('show');
    loader.classList.add('hide');
}

function showLoader() {
    loader.classList.remove('hide');
    loader.classList.add('show');
}
//#endregion