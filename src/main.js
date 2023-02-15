
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key' : API_KEY,
        'language': 'es-CO'
    },

})

async function renderimages(movies,container){
    container.innerHTML = "";
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        movieContainer.addEventListener('click',()=>{
            location.hash = '#movie='+movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src',
        'https://image.tmdb.org/t/p/w300'+movie.poster_path);
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer)
    });
}

async function renderlist(categorys,container){
    container.innerHTML = "";
    categorys.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const Title = document.createElement('h3');

        Title.classList.add('category-title');
        Title.setAttribute('id','id'+category.id);
        Title.textContent = category.name;
        Title.addEventListener('click',()=>{
            location.hash= `#category=${category.id}-${category.name}`
        })

        categoryContainer.appendChild(Title);
        container.appendChild(categoryContainer)
        
    });
}


async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/week');
    const movies = data.results;
    renderimages(movies,trendingMoviesPreviewList);
}

async function getCategorysPreview(){
    const {data} = await api('genre/movie/list');
    const categorys = data.genres;
    renderlist(categorys,categoriesPreviewList);
    
}

async function getMoviesByCategory(id){
    const {data} = await api('discover/movie',{
        params:{
            with_genres:id,
        },
    });
    const movies = data.results;
    renderimages(movies,genericSection);
}


async function getMoviesBySearch(query){
    const {data} = await api('search/movie',{
        params:{
            query,
        },
    });
    const movies = data.results;
    renderimages(movies,genericSection);
}


async function getTrendingMovies(){
    const {data} = await api('trending/movie/week');
    const movies = data.results;
    renderimages(movies,genericSection);
}


async function getDetailMovieById(id){
    const {data : movie} = await api('movie/'+id);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500'+movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    renderlist(movie.genres,movieDetailCategoriesList);
    getRelatedMoviesId(id);
}


async function getRelatedMoviesId(id){
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;
    renderimages(relatedMovies,relatedMoviesContainer)
}  