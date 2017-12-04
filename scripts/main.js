const searchBtn = document.getElementById('search');
const popularBtn = document.getElementById('popular');
const topRated = document.getElementById('top-rated');
const upComing = document.getElementById('up-coming');
const filmName = document.getElementById('film-name');
const API_KEY = 'f24a0fd18f52218851075901c5a108a0';
const listItemBlock = document.getElementById('list-item');

const imgFullPath = imgEl =>{
    return (imgEl === null) ? 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Нет_фото.png' : `https://image.tmdb.org/t/p/w300${imgEl}`;
};

const filmDescription = (filmTex) =>{
    return (filmTex === "") ? "Описание отсутствует" : filmTex.substr(0,100);
};

const searchFilm = (e) => {
    e.preventDefault();
    let allFilms = "";
    listItemBlock.innerHTML = '';
    if (filmName.value !== '') {
        fetch('https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + '&query=' + filmName.value)
            .then(response => {
                    if (response.status == 200) {
                        return response.json();
                    }
                    throw new Error("Error fetching data");
                }
            ).then(data => {
            console.log("DATA", data);
            const listFilms = data.results;
            if (listFilms.length === 0) {
                listItemBlock.innerHTML = '<p class="MovieList__msg"> SORRY, WE DIDN\'T FIND ANYTHING (⌣́_⌣̀)</p>';
            } else {
                listFilms.forEach((el) => {
                    allFilms += `<div class="MovieList__item">
                            <div class="MovieCard">
                                <span class="MovieCard__rating">${el.vote_average}</span>
                                <img class="MovieCard__poster"  src='${imgFullPath(el.poster_path)}' alt="">
                                <div class="MovieInfo__info">
                                    <h2 class="MovieInfo__title">${el.title}</h2>
                                    <p class="MovieInfo__descr">${filmDescription(el.overview)}</p>
                                    <p class="MovieInfo__release">Release date:${el.release_date.split('-')[0]}</p>
                                </div>
                                <button class="MovieCard__btn">+</button>
                            </div>
                        </div>`;
                    listItemBlock.innerHTML = allFilms;
                });
            }
        }).catch(error => {
            console.error("Error: ", error);
        });
    }
    else{
        alert("Введите название фильма!");
    }
    filmName.value = '';
};
searchBtn.addEventListener('click',searchFilm);

const filmRating = (param) => {
    listItemBlock.innerHTML = '';
    let films ="";
    fetch(`https://api.themoviedb.org/3/movie/${param}?api_key=` + API_KEY)
        .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw new Error("Error fetching data");
            }
        ).then(data => {
        const listFilms = data.results;
        listFilms.forEach ((el) => {
            let filmInfo = {
                vote_average:""+el.vote_average,
                poster_path: ""+imgFullPath(el.poster_path),
                title:""+el.title,
                overview:""+filmDescription(el.overview),
                release_date:""+el.release_date.split('-')[0]
            };

            let tmpl = '<div class="MovieList__item"><div class="MovieCard"><span class="MovieCard__rating">{{vote_average}}</span><img class="MovieCard__poster" src={{poster_path}}  alt=""><div class="MovieInfo__info"> <h2 class="MovieInfo__title">{{title}}</h2> <p class="MovieInfo__descr">{{overview}}</p> <p class="MovieInfo__release">Release date:{{release_date}}</p> </div> <button class="MovieCard__btn">+</button></div></div>'
            let htmlOutput = Mustache.to_html(tmpl, filmInfo);
            films +=htmlOutput;
        });
        listItemBlock.innerHTML = films;
    });
};

popularBtn.addEventListener('click',() => {filmRating("popular")});
topRated.addEventListener('click',() => {filmRating("top_rated")});
upComing.addEventListener('click',() => {filmRating("upcoming")});

const lightbtn = document.getElementById('light-btn');
const darkbtn = document.getElementById('dark-btn');

const toogleSheet = (urlSheet) => {
    document.getElementById("light-theme").setAttribute("href", urlSheet);
};

lightbtn.addEventListener('click',() => {
    toogleSheet("style/light-theme.css");
    localStorage.setItem("style","style/light-theme.css");
    toggleClass(lightbtn);
});
darkbtn.addEventListener('click',() => {
    toogleSheet("style/dark-theme.css");
    localStorage.setItem("style","style/dark-theme.css");
    toggleClass(darkbtn);
});

const toggleClass = (elem) => {
    var ar = document.getElementsByClassName('themeBtn');
    for (let i of ar) {
        (!i.classList.contains('active')) ? i.classList.add('active') : i.classList.remove('active')
    }
};
(window.localStorage) ?
    (localStorage.getItem("style") === "style/dark-theme.css") ?
        (
            darkbtn.classList.add('active'),
                document.getElementById("light-theme").setAttribute("href","style/dark-theme.css")
        )
        :
        (
            lightbtn.classList.add('active'),
                document.getElementById("light-theme").setAttribute("href","style/light-theme.css")
        ):
    alert("Don't support localstorage");



