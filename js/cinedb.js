const navegador = document.querySelectorAll("#navbarNav>ul>li>a")
const secciones = document.querySelectorAll("#secciones>div.row")
const autor = document.querySelector("#pie>div:nth-child(1)>h3")
const buscador = document.querySelector("#patron")
let resultado = document.querySelector("#resul>tbody")
let favoritos = []


document.addEventListener("DOMContentLoaded", function(){
    autor.textContent = "Autor: Lola Illán"
    //Oculto todas la secciones menos la de Inicio
    for(i=1; i<=secciones.length-1; i++){
        secciones[i].setAttribute("hidden", true)
    }

    //A forEach le podemos pasar como parámetro, objeto e indice o sólo objeto
    navegador.forEach ((nav, idx) =>{
        //A cada elemento del navegador le añado un evento y llamo a la función pasandole un indice
        nav.addEventListener("click", function(){
            //a la función le paso el índice del elemento en el que hemos hecho click
            esconderNavBar(idx)   
        })
    })
})

function esconderNavBar(idx){
    //elimino la clase "active" de todos los elementos del navegador
    navegador.forEach(nav=>{
        nav.classList.remove("active")
    })
    //ocultar todas las secciones
    secciones.forEach(seccion =>{ 
        seccion.setAttribute("hidden", true)
      
    })
    //muestro la sección a la que hacemos click con el idx y le añado la clases "active" 
    secciones[idx].removeAttribute("hidden")
    navegador[idx].classList.add("active")
        if(idx == 1){
            //llamada a función al pulsar favoritos
            favoritosNavBar()
        }
}


buscador.addEventListener("keyup", function(ev){
    buscador.innerHTML = ""
    if(ev.key == "Enter"){
        //Consulta a la API para obtener datos de pelicula según texto del buscador
        //String(buscador.value).toLowerCase().trim()
        fetch("http://www.omdbapi.com/?s=" +  String(buscador.value).trim() + "&apikey=ae7f046c")
        .then(response =>{
            if(response.status == 200){
                return response.json()
            }
        })
        .then((peliculas)=>{
            //vacio los resultados previos que pueda haber
            resultado.innerHTML = ""
            //recorro el resultado del json, en concreto su atributo Search 
            peliculas.Search.forEach(pelicula =>{
                let nuevaFila = resultado.insertRow()
                let celda1 = nuevaFila.insertCell()
                let celda2 = nuevaFila.insertCell()
                let img = document.createElement("img")
                img.src = pelicula.Poster
                celda1.append(img)
                celda2.innerHTML = pelicula.Title+" ("+pelicula.Year+")"
                
                //Añado evento al <tr> donde tengo las película
                nuevaFila.addEventListener("click", function(){
                    //Consulta a la API para obtener datos de película pasándole un id
                    fetch("http://www.omdbapi.com/?i=" + pelicula.imdbID + "&apikey=ae7f046c")
                    .then(response =>{
                        if(response.status == 200){
                            return response.json()
                        }
                    })
                    .then((pelicula)=>{
                        //En la variable detalle inserto html con el código que contiene la información
                        let detalle = `
                        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                        <header class="modal__header">
                            <h2 class="modal__title" id="modal-1-title">
                                ${pelicula.Title}
                            </h2>
                            <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
                        </header>
                        <main class="modal__content" id="modal-1-content">
                        <div class="row">
                        <div class="col-7">
                            <dl>
                                <dt>Año</dt>
                                <dd>${pelicula.Year}</dd>
                            </dl>
                            <dl>
                                <dt>Duración</dt>
                                <dd>${pelicula.Runtime}</dd>
                            </dl>
                            <dl>
                                <dt>Géneros</dt>
                                <dd>${pelicula.Genre}</dd>
                            </dl>
                            <dl>
                                <dt>Dirección</dt>
                                <dd>${pelicula.Director}</dd>
                            </dl>
                            <dl>
                                <dt>Reparto</dt>
                                <dd>${pelicula.Actors}</dd>
                            </dl>
                            <dl>
                                <dt>Sinopsis</dt>
                                <dd>${pelicula.Plot}</dd>
                            </dl>
                            <dl>
                                <dt>País</dt>
                                <dd>${pelicula.Country}</dd>
                            </dl>
                            <dl>
                                <dt>Enlace a IMDB</dt>
                                <dd><a href="https://www.imdb.com/title/${pelicula.imdbID}" target="_blank">${pelicula.Title} en IMDB</a></dd>
                            </dl>
                            <dl>
                                <dt>Puntuación de IMDB</dt>
                                <dd>${pelicula.imdbRating}</dd>
                            </dl>
                        </div>
                        <div class="col-5">
                            <img src="${pelicula.Poster}" class="card-img-top">
                        </div>
                        </div>
                        </main>
                        <footer class="modal__footer">
                            <button class="btn btn-secondary">Close</button>
                            <button class="btn btn-primary favorito">Favoritos</button>
                        </footer>
                        </div>`
                        
                        //inserto en el modal el detalle y lo muestro
                        let modal = document.querySelector("#modal-1")
                        let detalleModal = document.querySelector(".modal__overlay")
                        detalleModal.innerHTML = detalle
                        modal.style.display = "block"

                        //evento para cerrar modal desde "x" de la esquina
                        let cerrarCruz= document.querySelector(".modal__close")
                        cerrarCruz.addEventListener("click", function(){
                            modal.style.display = "none"
                        })

                        //evento para cerrar modal desde boton de Close
                        let btnClose = document.querySelector(".btn-secondary")
                        btnClose.addEventListener("click", function(){
                            modal.style.display = "none"
                        })

                        //evento para con el foton de "Favorito" añadir película a la sección favoritos
                        let btnFav = document.querySelector(".favorito")
                        btnFav.addEventListener("click", function(){
                            if(favoritos.length == 0){
                                favoritos.push(pelicula)
                                modal.style.display = "none"
                            }else {
                                //para buscar elementos en un array de objetos se puede usar filter y find
                                //FIND (devulve un objeto)
                                // if(!favoritos.find(fav=>fav.Title==pelicula.Title)){
                                //     favoritos.push(pelicula)
                                //     modal.style.display = "none"
                                //   }
                                  //FILTER(devulve un array de objetos)
                                // if(favoritos.filter(fav=>fav.Title==pelicula.Title).length==0){
                                //     favoritos.push(pelicula)
                                //     modal.style.display = "none"
                                //   }
                                let encontrado = false
                                for(i=0; i<=favoritos.length-1; i++){
                                    if(favoritos[i].Title.includes(pelicula.Title) == true ){
                                        encontrado = true
                                    }
                                }   
                                if(encontrado == false){
                                    favoritos.push(pelicula)
                                }
                                modal.style.display = "none"
                            }
                            modal.style.display = "none"
                        })
                    })
                })
            })
        })
    }
})

function favoritosNavBar() {
    //extraigo en variable el lugar donde colocaré el template
    let contenidoFav = document.querySelector("#favoritos")
    contenidoFav.innerHTML = "<h3>Favoritos</h3>"
    favoritos.forEach((pelicula, indice) =>{
        //let contenidoFav = document.querySelector("#favoritos")
        //guardo el template en una variable 
        let template = `
        <div class="card text-center bg-light mb-2 mr-2">
        <a>
            <img src="${pelicula.Poster}" class="card-img-fav">
        </a>
        <div class="card-body">
            <p class="card-text">${pelicula.Title}(${pelicula.Year})</p>
            <button type="button" class="btn btn-primary" id="detalle">Detalles</button>
            <button type="button" class="btn btn-danger" id="borrar">Borrar</button>
        </div>
        </div>
        ` 
        //inserto el template en su lugar correspondiente en el HTML
        contenidoFav.innerHTML = contenidoFav.innerHTML + template
       
    })

    //boton para eliminar de favoritos la película
    //guardo todos los botones borrar que hay en las películas de favoritos
    let botonesBorrar=document.querySelectorAll("#borrar")
    //recorro los botones y de cada boton cojo objeto e indice
    botonesBorrar.forEach((boton,idx)=>{
        //a cada boton le añado un evento click
        boton.addEventListener("click", function(){
            favoritos.splice(idx, 1)
            favoritosNavBar()
        })
    })

    //boton para ver detalle de la película desde favoritos
    let detallePelicula = document.querySelectorAll("#detalle")
    detallePelicula.forEach((boton, idx)=>{
        boton.addEventListener("click", function(){
           
            let detalle = `
            <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            <header class="modal__header">
                <h2 class="modal__title" id="modal-1-title">
                    ${favoritos[idx].Title}
                </h2>
                <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
            </header>
            <main class="modal__content" id="modal-1-content">
            <div class="row">
            <div class="col-7">
                <dl>
                    <dt>Año</dt>
                    <dd>${favoritos[idx].Year}</dd>
                </dl>
                <dl>
                    <dt>Duración</dt>
                    <dd>${favoritos[idx].Runtime}</dd>
                </dl>
                <dl>
                    <dt>Géneros</dt>
                    <dd>${favoritos[idx].Genre}</dd>
                </dl>
                <dl>
                    <dt>Dirección</dt>
                    <dd>${favoritos[idx].Director}</dd>
                </dl>
                <dl>
                    <dt>Reparto</dt>
                    <dd>${favoritos[idx].Actors}</dd>
                </dl>
                <dl>
                    <dt>Sinopsis</dt>
                    <dd>${favoritos[idx].Plot}</dd>
                </dl>
                <dl>
                    <dt>País</dt>
                    <dd>${favoritos[idx].Country}</dd>
                </dl>
                <dl>
                    <dt>Enlace a IMDB</dt>
                    <dd><a href="https://www.imdb.com/title/${favoritos[idx].imdbID}" target="_blank">${favoritos[idx].Title} en IMDB</a></dd>
                </dl>
                <dl>
                    <dt>Puntuación de IMDB</dt>
                    <dd>${favoritos[idx].imdbRating}</dd>
                </dl>
            </div>
            <div class="col-5">
                <img src="${favoritos[idx].Poster}" class="card-img-top">
            </div>
            </div>
            </main>
            <footer class="modal__footer">
                <button class="btn btn-secondary">Close</button>
            </footer>
            </div>`
            
            //inserto en el modal el detalle y lo muestro
            let modal = document.querySelector("#modal-1")
            let detalleModal = document.querySelector(".modal__overlay")
            detalleModal.innerHTML = detalle
            modal.style.display = "block"

            //evento para cerrar modal desde "x" de la esquina
            let cerrarCruz= document.querySelector(".modal__close")
            cerrarCruz.addEventListener("click", function(){
                modal.style.display = "none"
            })

            //evento para cerrar modal desde boton de Close
            let btnClose = document.querySelector(".btn-secondary")
            btnClose.addEventListener("click", function(){
                modal.style.display = "none"
            })

        })
    })
}
