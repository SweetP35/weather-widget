import conditions from "./conditions.js";
import cities from "./cities.js";


const apiKey = '3329ee16dde44cc7988143613242509';
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const header = document.querySelector('.header');
const citiesArr = getAllCities(cities);
const selectBody = document.querySelector('.select-body');
let timer

function getAllCities(cities) {
    let result = [];
    cities.forEach(el => {
        if (el.areas && el.areas.length) {
            result.push(...getAllCities(el.areas))
            return
        }
        result.push(el)
    });
    return result
}

function filterCities(letters) {
    const neededCities = citiesArr.filter(({ name }) => {
        const nameCities = name.toLowerCase();
        return nameCities.startsWith(letters.toLowerCase());
    }).slice(0, 10)
    return neededCities
}

input.addEventListener('input', (event) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
        const letters = event.target.value;
        selectBody.innerHTML = '';
        const filteredCities = filterCities(letters);
        if (letters.length > 0) {
            form.classList.add('_active');
            removeCard()
        } else {
            form.classList.remove('_active');
            selectBody.style.height = '0px';
            return
        }
        if (filteredCities.length === 0) {
            form.classList.remove('_active');
            removeCard()
            showError('Город не найден');
        } else {
            filteredCities.forEach(({ name }) => {
                const html = `<div class="select-body-item">${name}</div>`
                selectBody.insertAdjacentHTML('beforeend', html)
            })
        }
        const selectHeight = selectBody.scrollHeight;
        selectBody.style.height = selectHeight > 500 ? '500px' : 'auto';
    }, 1000)
})

selectBody.addEventListener('click', (event) => {
    const selectedCity = event.target.innerText;
    input.value = selectedCity;
    form.classList.remove('_active');
    selectBody.style.height = '0px'
});

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
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    try {
        const response = await fetch(url);
        return await response.json();
    } catch {
        return { error: { message: 'Не удалось загрузить погоду. Проверьте интернет-соединение' } };
    }
}


// Слушаем отправку формы
form.onsubmit = async function (e) {
    form.classList.remove('_active');
    selectBody.style.height = '0px'
    e.preventDefault();
    let city = input.value.trim();
    const data = await getWeather(city);
    if (data.error) {
        removeCard();
        showError(data.error.code === 1006 ? 'Город не найден' : data.error.message);
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
