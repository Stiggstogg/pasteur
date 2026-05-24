import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {CrystalLocation} from "../helper/types";
import BasicGameScene from "./BasicGameScene";

// "Game" scene: Scene for the main game
export default class GameScene extends BasicGameScene {

    // Constructor
    constructor() {
        super('Game', 'soundtrackGame');
    }

    // Creates all objects of this scene
    create(): void {

        // execute the create function of the parent class
        super.create();

        // create the crystals
        this.createCrystals();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // execute the update function of the parent class
        super.update(_time, _delta);

    }

    // Create the crystals
    createCrystals() {

        super.createCrystals(gameOptions.numberOfCrystals);

    }

    // put crystal in a bowl
    putInBowl(location: CrystalLocation): void {

        super.putInBowl(location);

        // check if game is finished
        if (super.allCrystalsSorted()) {
            this.finishGame();
        }

    }

    // put in microscope
    putInMicroscope(crystal: Crystal) {

        super.putInMicroscope(crystal);

        // check if this is the first click (timer is running) and start the timer
        if (!this.timerRunning) {
            this.startTime = Date.now();
            this.timerRunning = true;
        }

    }

    finishGame() {

        // cleanup the scene (Three Scene)
        this.cleanupScene();

        // calculate the final score
        const score = this.calculateScore();

        // change the scene
        this.cameras.main.fadeOut(gameOptions.fadeInOutTime);   // fade out the screen

        this.cameras.main.once('camerafadeoutcomplete', () => {                                 // change the scene when the screen is faded out
            this.scene.start('Win', {leftBowlEE: this.eeLeft, rightBowlEE: this.eeRight, time: this.formatTime(this.elapsedTime), score: score});
        });

    }

}