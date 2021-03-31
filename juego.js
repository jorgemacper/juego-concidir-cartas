/*

Juego "Coincidir cartas"

El juego consiste en coincidir 2 cartas iguales hasta completar todas las cartas

Cuando el jugador haya coincidido todas las cartas habrá completado el juego y se le devolverá el números de equivocaciones que tuvo

*/

// Variables globales
 
const container = document.getElementById('container')
const btnEmpezar = document.getElementById('btn-empezar')

const errPl = errores => {
    if (errores === 1) {
        return 'vez'
    } else {
        return 'veces'
    }
}

const restarOpcion = (lista, item) => {
    return lista.filter( e => e !== item)
}

const generarPartida = serie => {
    let p = []
    for (let id in serie) {
        p.push(id)
    }
    return p
}

const desordenarNumeros = lista => {
    lista = lista.sort(() => { return Math.random() - 0.5 })
    return lista
}

class Juego {
    constructor() {
        this.inicializar()
        this.generarPartida()
        this.comenzarJuego()
    }

    inicializar() {
        alert('Haz coincidir todas las cartas para completar el juego.')
        this.serie = {}
        this.partida = []
        this.errores = 0
        this.primeraCarta = ''
        this.segundaCarta = ''

        this.crearPartida = this.crearPartida.bind(this)
        this.mostrarCarta = this.mostrarCarta.bind(this)
        this.generarSerie = this.generarSerie.bind(this)
        this.valorarResultado = this.valorarResultado.bind(this)
        this.mensajeFinal = this.mensajeFinal.bind(this)
    }

    generarPartida() {
        // Ocultamos el botón de "Jugar" y vaciamos el container de elementos
        btnEmpezar.classList.add('hide')
        container.textContent = ''

        // Generar la serie de la partida
        this.serie = this.generarSerie()

        // Generar partida obteniendo los ids aleatorios en un Array
        this.partida = generarPartida(this.serie)

        // Se desordena la partida de manera aleatoria
        this.partida = desordenarNumeros(this.partida)

        // Se crear la partida en el display del browser
        this.crearPartida(this.partida)
    }

    generarSerie() {
        // Esta función genera un objeto con la serie del juego, con un id para la card y el valor de la misma
        let serie = {}
        let valor = 1
        for (let i = 1; i < 17; i++) {
            let serieId = this.generarId()
            serie[serieId] = valor
            if (i % 2 === 0) {
                valor += 1
            }
        }
        return serie
    }

    generarId() {
        // Esta función genera un string aleatorio de 4 caracteres de la [a-z]
        const caracteres = 'abcdefghijklmnñopqrstuvwxyz'
        let result = ''
        for (let i = 0; i<4; i++) {
            result += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        }
        return result
    }

    crearPartida(partida) {
        // Esta función crea las cards (tanto la card que oculta el número como la card que la muestra) de la partida en el browser para el jugador
        for (let i = 0; i < partida.length; i++){
            this.newCard = document.createElement("div")
            this.newCard.setAttribute("id", `${partida[i]}`)
            this.newCard.setAttribute("class", "card")
            container.appendChild(this.newCard)
            this.newCardWithNumber = document.createElement("div")
            this.newCardWithNumber.setAttribute("id", `${partida[i]}-val`)
            this.newCardWithNumber.setAttribute("class", "card-num hide")
            // añadir valor del número en el interior
            container.appendChild(this.newCardWithNumber)
        }
    }

    comenzarJuego() {
        // Seleccionamos todas las cards en la variable 'this.cards'
        this.cards = document.querySelectorAll('.card')
        // Seleccionamos todas las cards que contiene el número en la variable 'this.cardsWithNumber'
        this.cardsWithNumber = document.querySelectorAll('.card-num')

        // Con el método forEach desplegamos todas las cards mostradas en pantalla
        this.cards.forEach(card => {
            // Con el método addEventListener se obtiene el valor de la card a la cuál el usuario hace clic
            card.addEventListener("click", () => {
                // Se evalua si las variables this.primeraCarta y this.segundaCarta contienen un valor o están vacías
                if (this.primeraCarta === '') {
                    // Si this.primerCarta esta vacía, se le asigna el valor de la card la cual el usuario hizo clic
                    this.primeraCarta = card
                    // Se muestra en pantalla el valor de la card con la función this.mostrarCarta()
                    this.mostrarCarta(this.primeraCarta)
                } else if (this.segundaCarta === '') {
                    // Si this.primerCarta contiene un valor, entonces se evalúa si this.segundaCarta está vacía o no
                    // Si this.segundaCarta esta vacía, se le asigna el valor de la card la cual el usuario hizo clic
                    this.segundaCarta = card
                    // Se muestra en pantalla el valor de la segunda card con la función this.mostrarCarta()
                    this.mostrarCarta(this.segundaCarta)

                    // Luego se valora si las dos cartas que el usuario seleccionó son iguales o no con la función this.valorarResultado()
                    this.valorarResultado(this.primeraCarta, this.segundaCarta)
                }
                // Se valora si el Array this.partida está vacío
                if (this.partida.length === 0) {
                    // Si el Array this.partida está vacío es que se completaron todas las cartas y por tanto, el juego ha terminado
                    setTimeout(() => {
                        // Se ocultan las cartas del browser
                        this.cardsWithNumber.forEach(card => {
                            card.classList.add('hide')
                        })

                        // Se muestra el mensaje final llamando a la función this.mensajeFinal()
                        this.mensajeFinal()

                    }, 500)
                }
            }, false)
        })
    }

    mensajeFinal() {
        // Función para mostrar el mensaje final una vez termine la partida
        let mensajeFinal = document.createElement("div")
        mensajeFinal.setAttribute("class", "msg-win")
        let mensaje = `
        <h2>¡Enhorabuena!</h2>
        <h3>has completado todas las cartas :)</h3>
        <p>Te equivocaste un total de <strong>${this.errores} ${errPl(this.errores)}</strong></p>
        `
        mensajeFinal.innerHTML = mensaje
        container.appendChild(mensajeFinal)
        btnEmpezar.textContent = "Jugar de nuevo"
        btnEmpezar.classList.remove('hide')
    }

    mostrarCarta(card) {
        // Función que muestra el valor de la carta
        this.cardWithNumberId = card.id + '-val'
        this.cardWithNumber = document.getElementById(this.cardWithNumberId)
        if (!card.classList.contains('hide')) {
            card.classList.add('hide')
            this.cardWithNumber.classList.remove('hide')
            this.cardWithNumber.textContent = this.serie[card.id]
        }
    }

    ocultarCarta(card) {
        // Función que oculta el valor de la carta
        this.cardWithNumberId = card.id + '-val'
        this.cardWithNumber = document.getElementById(this.cardWithNumberId)
        if (card.classList.contains('hide')) {
            card.classList.remove('hide')
            this.cardWithNumber.classList.add('hide')
        }       
    }

    valorarResultado(primeraOpcion, segundaOpcion) {
        // Función que evalúa si las dos opciones en las que el usuario hizo clic son iguales o no
        // Con las variables this.primeraCartaValor y this.segundaCartaValor recogemos el valor de la carta a través del id
        this.primeraCartaValor = this.serie[primeraOpcion.id]
        this.segundaCartaValor = this.serie[segundaOpcion.id]

        // Se evalúan si continen el mismo valor ambas cartas
        if (this.primeraCartaValor !== this.segundaCartaValor) {
            // Si los valores son distintos, se ocultan las cartas y el usuario debe seguir jugando
            setTimeout(() => this.ocultarCarta(primeraOpcion), 500)
            setTimeout(() => this.ocultarCarta(segundaOpcion), 500)

            // se añade el primer fallo a la variable this.errores
            this.errores += 1
        } else {
            // Si los valores son iguales, quitamos las ids del Array this.partida
            this.partida = restarOpcion(this.partida, primeraOpcion.id)
            this.partida = restarOpcion(this.partida, segundaOpcion.id)
        }

        // Finalmente volvemos a vaciar las variables this.primeraCarta y this.segundaCarta para que el usuario vuelva a escoger nuevas opciones
        this.primeraCarta = ''
        this.segundaCarta = ''
    }
}


function empezarJuego() {
    window.juego = new Juego()
}