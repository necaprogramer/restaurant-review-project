import { API_URL, BEARER_TOKEN } from './api-config.js';

let buttonBurgers = document.getElementById('burgers');
let buttonMexican = document.getElementById('mexican');
let buttonJapanese = document.getElementById('japanese');

buttonBurgers.addEventListener('click', () => {
    getRequest('burgers');
});

buttonMexican.addEventListener('click', () => {
    getRequest('mexican');
});

buttonJapanese.addEventListener('click', () => {
    getRequest('japanese');
});

let containerDiv = document.getElementById('container');

async function getRequest(category){
    try{
        const res = await axios.get(API_URL + `&categories=${category}`, {headers:{Authorization: `Bearer ${BEARER_TOKEN}`}});
        handleData(res);
    }
    catch(e){
        console.log(e);
    }
}

function handleData(result){
    console.log(result.data.businesses);
    let array = result.data.businesses;
    array.forEach(restaraunt => {
        createRestrauntCard(restaraunt.name, restaraunt.image_url, restaraunt.rating, restaraunt.price, restaraunt.url);
    });
}

function createRestrauntCard(restrauntName, restrauntImage, restrauntRating, restrauntPrice, restrauntLink){
    let restarauntDiv = document.createElement('div');
    containerDiv.appendChild(restarauntDiv);
    restarauntDiv.classList.add('restraunt-container');

    let name = document.createElement('h3');
    restarauntDiv.appendChild(name);
    name.innerText = restrauntName;

    let image = document.createElement('img');
    restarauntDiv.appendChild(image);
    image.setAttribute('src', restrauntImage);

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