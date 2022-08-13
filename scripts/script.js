import { API_URL, BEARER_TOKEN } from './api-config.js';

const TOTAL_RESTAURANTS = 1000;

let containerDiv = document.getElementById('container');
let buttonBurgers = document.getElementById('burgers');
let buttonMexican = document.getElementById('mexican');
let buttonJapanese = document.getElementById('japanese');

let loader = document.getElementById('loader');
hideLoader();

let limitOfShownRestaurants = 15;
let offsetOfShownRestaurants = 0;
let totalShownRestaurants = 0;

buttonBurgers.addEventListener('click', () => {
    getRequest('burgers', offsetOfShownRestaurants, limitOfShownRestaurants);
    totalShownRestaurants += 15;
    infiniteScroll('burgers');
});

buttonMexican.addEventListener('click', () => {
    getRequest('mexican');
});

buttonJapanese.addEventListener('click', () => {
    getRequest('japanese');
});

function infiniteScroll(category){
    window.addEventListener('scroll', () =>{
        if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight){
            showLoader();
            setTimeout(() => {
                if(totalShownRestaurants != TOTAL_RESTAURANTS){
                    offsetOfShownRestaurants += 15;
                    getRequest(category, offsetOfShownRestaurants, limitOfShownRestaurants);
                    totalShownRestaurants += 15;
                }
                hideLoader();
            }, 800)
        }
    });
}

async function getRequest(category, offset, limit){
    try{
        const res = await axios.get(API_URL + `&categories=${category}&offset=${offset}&limit=${limit}`, {headers:{Authorization: `Bearer ${BEARER_TOKEN}`}});
        getData(res);
    }
    catch(e){
        console.log(e);
    }
}

function getData(result){
    console.log(result.data.businesses);
    let array = result.data.businesses;
    array.forEach(restaurant => {
        createRestaurantCard(restaurant.name, restaurant.image_url, restaurant.rating, restaurant.price, restaurant.url);
    });
}

function createRestaurantCard(restaurantName, restaurantImage, restaurantRating, restaurantPrice, restaurantLink){
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

function hideLoader(){
    loader.classList.remove('show');
    loader.classList.add('hide');
}

function showLoader(){
    loader.classList.remove('hide');
    loader.classList.add('show');
}