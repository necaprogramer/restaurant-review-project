import { API_URL, BEARER_TOKEN } from './api-config.js';

let containerDiv = document.getElementById('container');
let buttonBurgers = document.getElementById('burgers');
let buttonMexican = document.getElementById('mexican');
let buttonJapanese = document.getElementById('japanese');

let loader = document.getElementById('loader');
hideLoader();

let limitOfShownRestraunts = 15;
let offsetOfShownRestraunts = 0;
let totalShownRestraunts = 0;

buttonBurgers.addEventListener('click', () => {
    getRequest('burgers', offsetOfShownRestraunts, limitOfShownRestraunts);
    totalShownRestraunts += 15;
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
                if(totalShownRestraunts != 1000){
                    offsetOfShownRestraunts += 15;
                    getRequest(category, offsetOfShownRestraunts, limitOfShownRestraunts);
                    totalShownRestraunts += 15;
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
    array.forEach(restaraunt => {
        createRestrauntCard(restaraunt.name, restaraunt.image_url, restaraunt.rating, restaraunt.price, restaraunt.url);
    });
}

function createRestrauntCard(restrauntName, restrauntImage, restrauntRating, restrauntPrice, restrauntLink){
    var restarauntDiv = document.createElement('div');
    containerDiv.appendChild(restarauntDiv);
    restarauntDiv.classList.add('restraunt-container');

    let name = document.createElement('h3');
    restarauntDiv.appendChild(name);
    name.innerText = restrauntName;

    let image = document.createElement('div');
    restarauntDiv.appendChild(image);
    image.setAttribute('style', `background-image: url(${restrauntImage});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 10em;`);


    let ratingAndPrice = document.createElement('div');
    restarauntDiv.appendChild(ratingAndPrice);
    ratingAndPrice.innerText = restrauntRating + restrauntPrice;

    let button = document.createElement('button');
    restarauntDiv.appendChild(button);
    let link = document.createElement('a');
    button.appendChild(link);
    link.setAttribute('href', restrauntLink);
    link.innerText = 'Link to restraunt website';
}

function hideLoader(){
    loader.classList.remove('show');
    loader.classList.add('hide');
}

function showLoader(){
    loader.classList.remove('hide');
    loader.classList.add('show');
}