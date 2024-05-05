document.addEventListener("DOMContentLoaded", () => {
    new Memorama();
});

const imageButton = document.getElementById('imageButton');
const myImages = Array.from(document.querySelectorAll('.back'));
const imageSources = ['./img/card-back1.png', './img/card-back2.png'];
const tileImage = document.querySelector('.tileImage');
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
        },5000 );
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
            if (this.card1 == this.card2) {
                this.canPlay = false;                
                setTimeout(this.checkIfWon.bind(this), 300);
                this.counterPositive();                
            } 
            else {
                this.canplay = false;                
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
            alert(
            `¡Ganaste! Tus stats son:

        Errores : '${this.notPair}'
        Aciertos: '${this.foundPairs}'`);            
            this.setNewGame();
        }
    }    
    setNewGame() {
        this.removeClickEvents();
        this.cards.forEach( card => card.classList.remove('opened'));
        setTimeout(this.startGame.bind(this), 1000)
    }
}