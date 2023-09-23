//DOM elements 
const form = document.querySelector('#search-form');
const input = document.querySelector('#search-term');
const msg = document.querySelector('.form-msg');
const list = document.querySelector('.cities');


//API key

const apiKey = "4a1a4a999ed0a5a1d2585585bf91e97a";

form.addEventListener('submit', e => {
    //prevent default form submission 
    e.preventDefault();

    // Hide any message that might be displayed
    msg.textContent = ' ';
    msg.classList.remove('visible');

    //get the search value
    let inputVal = input.value;

    //check if there's already a city that matches the search criteria 
    const listItemsArray = Array.from(list.querySelectorAll('.cities li'))
    //list points to main <ul> (the parent element of the cities), QuerySelectorAll basically takes all the notes of cities li and these
    //are put inside of an array object. We do this to compare what we just wrote with what we already have, this help us to not add a town that we have already. 

    //in practice: if we have already some cities added
    if (listItemsArray.length > 0){
        //then we can start comparing
        const filteredArray = listItemsArray.filter(el => {
            let content = ' ';
            let cityName = el.querySelector('.city__name').textContent.toLowerCase()
            //in cityName var we are getting the content (.city_name) and we transform it in lowercase
            let cityCountry = el.querySelector('.city__country').textContent.toLowerCase();
            //in cityCountry var we are getting the content (.city_country) and we transform it in lowercase

            //we want to check city and the country format 
            if (inputVal.includes(',')) {
				// If the country code is invalid (ex. athens,grrrr), keep only the city name
				if (inputVal.split(',')[1].length > 2) {
					inputVal = inputVal.split(',')[0]

                    // Get the content from the existing city
                    content = cityName //we updating the content variable 
                }else {
                    //if we have a valid format, the city and the country 
                    content = `${cityName}, ${cityCountry}`; //js + html 
                    //not elegant way: content = cityName + ',' + cityCountry;
                }
            }else {
                // Only the <city> format is used
                content = cityName;
            }
            // Return whether or not the existing content matches the form input value
			return content == inputVal.toLowerCase()
        });

        //what happens when we meet the criteria 
        if(filteredArray.length > 0){
            msg.textContent = `you already know the weather for ${filteredArray[0].querySelector('.city__name').textContent} 
            ...otherwise be more specific by providing the country code as well 🌚`;
            //adding a class to make visible the msg 
            msg.classList.add('visible');

            //in case we didn't find any match we reset the form input 
            form.reset();
            input.focus();

            return
        }
    }

    //AJAX = Asynchronose Javascript And XML:  
    //it allows web pages to be updated asynchronasly by exhanching data with web server (without refresh the page)
                                                        //under q we are sending the input value (whatever we typed here)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&APPID=${apiKey}&units=metric`

    //let's do the call to the api using fetch from AJAX
    fetch(url)//we make the request to the server 
        .then(response => response.json()) //the servere give's the response
        .then(data => {
            console.log('data = ', data);
         //and then it gives us the actual data that we can work with
            //with the data we can do the following (by using console.log(data) we will see an obj with a bunch of information in it)
            
            //we say what do in case of 404 error 
            if (data.cod == '404'){
                throw new Error(`${data.cod}, ${data.message}`);
            }
            //we destructuring the big obj of data in smaller piecies
            const {main, name, sys, weather} = data; //parsing the data that we recieve and put in individual var (like main)

            //let's find the icon 
            const icon = `img/weather/${weather[0]['icon']}.svg`

            //let's create a card 
            const li = document.createElement('li')
            
            const markup = `
                <figure>
                    <img src="${icon}" alt="${weather[0]['description']}">
                </figure>

                <div>
                    <h2>${Math.round(main.temp)}<sup>°C</sup></h2> 
                    <p class="city__conditions">${weather[0]['description'].toUpperCase()}</p>
                    <h3><span class="city__name">${name}</span><span class="city__country">${sys.country}</span></h3>
                </div>`;

                li.innerHTML = markup;
                list.appendChild(li);
        })
        .catch(() => { //the catch refers to the fetch 
            msg.textContent = 'Please search for a valid city';
            msg.classList.add('visible');
        })
    //to reset the search bar after a research
    msg.textContent = ' '
    form.reset();
    input.focus();
})