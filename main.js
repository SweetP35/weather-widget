import conditions from "./conditions.js";



const apiKey = '3329ee16dde44cc7988143613242509';
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const header = document.querySelector('.header');

function removeCard() {
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    const html = `<div class="card">${errorMessage}</div>`
    header.insertAdjacentHTML('afterend', html);
}

function showCard(cardDetails) {
    const { name, country, temperature, condition, images } = cardDetails
    // Отображаем полученные данные в карточку
    //Разметка для карточки
    const html = `<div class="card">
        <div class="card-city">${name} <span>${country}</span></div>
        <div class="card-weather">
            <div class="card-value">${temperature}<sup>°c</sup></div>
            <img class="card-img" src="${images}" alt="Weather">
        </div>
        <div class="card-description">${condition}</div>
    </div>`;
    //Отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    return data
}


// Слушаем отправку формы
form.onsubmit = async function (e) {
    e.preventDefault();
    let city = input.value.trim();
    const data = await getWeather(city);
    if (data.error) {
        removeCard();
        showError(data.error.message);
    } else {
        removeCard();
        const info = conditions.find((el) => el.code === data.current.condition.code);
        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName;
        
        const cardDetails = {
            name: data.location.name,
            country: data.location.country,
            temperature: data.current.temp_c,
            condition: data.current.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'],
            images: imgPath
        }
        showCard(cardDetails);
    }
}
