document.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener('click', function() {
    new Memorama();
    startBtn.classList.add('hidden');
});

});

const imageButton = document.getElementById('imageButton');
const myImages = Array.from(document.querySelectorAll('.back'));
const imageSources = ['./img/card-back1.png', './img/card-back2.png'];
const tileImage = document.querySelector('.tileImage');
const startBtn = document.getElementById('start-btn');
let currentIndex = 0;  
isBackgroundChanged= false;        

imageButton.addEventListener('click', function() {
  tileImage.src = imageSources[currentIndex];
  currentIndex = (currentIndex + 1) % imageSources.length;  
  myImages.forEach((image) => {
    image.src = imageSources[currentIndex];    
  })  
  document.body.classList.toggle('change-background'); 
  isBackgroundChanged = !isBackgroundChanged;
});


class Memorama {
    constructor() {
        this.canPlay = false;
        this.card1 = null;
        this.card2 = null;
        this.avaibleImages = [16, 102, 103, 7];
        this.orderForThisRound = [];
        this.cards = Array.from( document.querySelectorAll(".board-game figure"));
        this.maxPairNumber = this.avaibleImages.length;
        this.startGame();
        this.container = document.querySelector('.container');
        this.stats = document.getElementById('stats');
    }
 
    startGame() {
        this.foundPairs = 0;
        this.notPair = 0;
        this.setNewOrder();
        this.setImagesInCards();
        this.openCards();
        this.resetStats();
    }
    setNewOrder() {
        this.orderForThisRound = this.avaibleImages.concat(this.avaibleImages);
        this.orderForThisRound.sort( () => Math.random() - 0.5 );
    }
    setImagesInCards() {
        for (const key in this.cards) {
            const card = this.cards[key];
            const image = this.orderForThisRound[key];
            const imgLabel = card.children[1].children[0];
            card.dataset.image = image;
            imgLabel.src = `./img/${image}.jpg`;
        }
    }
    flipCard(e) {
        const clickedCard = e.target;
        if (this.canPlay && !clickedCard.classList.contains('opened')) {
            clickedCard.classList.add('opened');
            this.checkPair( clickedCard.dataset.image);
        }
    }
    openCards() {
        this.cards.forEach(card => card.classList.add('opened'));
        setTimeout( () => {
            this.closeCards();
        },4000 );
    }
    closeCards() {
        this.cards.forEach( card => card.classList.remove('opened'));
        this.addClickEvents();
        this.canPlay = true;
    }
    addClickEvents() {
        this.cards.forEach( _this => _this.addEventListener('click', this.flipCard.bind(this)));
    }
    removeClickEvents() {
        this.cards.forEach( _this => _this.removeEventListener('click', this.flipCard));
    }
    checkPair(image) {
        if (!this.card1) this.card1 = image;
        else this.card2 = image;
        if (this.card1 && this.card2) {
            this.canPlay = false;                
            if (this.card1 == this.card2) {                
                setTimeout(this.checkIfWon.bind(this), 300);
                this.counterPositive();                
            } 
            else {                
                setTimeout(this.resetOpenedCards.bind(this), 400);
                this.counterNegative();                
            }
        }
    }

    counterPositive() {        
        const pPositive = document.getElementById('aciertos');
        pPositive.innerHTML = this.foundPairs + 1;
    }

    counterNegative() {                
        this.notPair++;
        const pNegative = document.getElementById('errores');
        pNegative.innerHTML = this.notPair;        
    }

    resetStats () {
        document.getElementById('aciertos').innerHTML = '<br>';
        document.getElementById('errores').innerHTML = '<br>';
    }

    resetOpenedCards() {
        const firstOpened = document.querySelector(`.board-game figure.opened[data-image='${this.card1}']`);
        const secondOpened = document.querySelector(`.board-game figure.opened[data-image='${this.card2}']`);
        firstOpened.classList.remove('opened');
        secondOpened.classList.remove('opened');
        this.card1 = null;
        this.card2 = null;
        this.canPlay = true;
    }
    checkIfWon() {
        this.foundPairs++;
        this.card1 = null;
        this.card2 = null;
        this.canPlay = true;
        if (this.maxPairNumber == this.foundPairs) {    
            this.stats = document.getElementById('stats');
            this.stats.classList.remove('hide');
            this.stats.classList.add('show');     
            this.container.classList.add('overlay');
            stats.innerHTML = 
            `<h2>¡Felicidades!</h2>
            <p>¡Ganaste! Tus stats son:</p>

            <p>Errores : '${this.notPair}'</p>
            <p>Aciertos: '${this.foundPairs}'</p>
            
            <button id="new-game-btn">
            <img class="icon" src="./img/refresh.svg" alt="Nuevo Juego">
            </button>`;
            ;            
        }
        const newGameBtn = document.getElementById('new-game-btn');
        newGameBtn.addEventListener('click', this.setNewGame.bind(this));
    }    
    setNewGame() {
        this.container.classList.remove('overlay');
        this.stats.classList.remove('show');
        this.stats.classList.add('hide');
        this.removeClickEvents();
        this.cards.forEach( card => card.classList.remove('opened'));
        setTimeout(this.startGame.bind(this), 1000)
    }
}