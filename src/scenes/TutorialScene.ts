import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {CrystalLocation, TutorialStates} from "../helper/types";
import BasicGameScene from "./BasicGameScene";
import TextBox from "../sprites/TextBox";
import TutorialStateManager from "../helper/TutorialStateManager";
import Continue from "../sprites/Continue";
import Hand from "../sprites/Hand";

// "Tutorial" scene: Scene for the main game
export default class GameScene extends BasicGameScene {

    private textBox!: TextBox;
    private stateManager!: TutorialStateManager;
    private handLeft!: Hand;
    private handRight!: Hand;
    private continue!: Continue;

    // Constructor
    constructor() {
        super('Tutorial', 'soundtrackTutorial');
    }

    // Creates all objects of this scene
    create(): void {

        // execute the create function of the parent class
        super.create();

        // create the state manager
        this.stateManager = new TutorialStateManager();

        // create tutorial objects
        this.createTutorialObjects();

        // setup the hands intro (first part of the tutorial)
        this.setupHandsIntro();

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // execute the update function of the parent class
        super.update(_time, _delta);

    }

    // Create tutorial objects
    createTutorialObjects() {

        // create the crystals
        this.createCrystals();

        this.allCrystals.forEach((crystal) => {
            crystal.hide();
        });

        // create the text box
        this.textBox = this.add.existing(new TextBox(this));

        // create the hands
        this.handLeft = this.add.existing(new Hand(this, 0.4 * gameOptions.gameWidth, 0.5 * gameOptions.gameHeight, false));
        this.handRight = this.add.existing(new Hand(this, 0.6 * gameOptions.gameWidth, 0.5 * gameOptions.gameHeight, true));
        this.handLeft.setVisible(false);
        this.handRight.setVisible(false);

        // create the continue button
        this.continue = this.add.existing(new Continue(this));

        this.continue.on('continue', () => {
            this.nextTutorialState();
        });

    }

    // Create the crystals
    createCrystals() {

        super.createCrystals(gameOptions.numberOfCrystalsTutorial);

    }

    // put crystal in a bowl
    putInBowl(location: CrystalLocation): void {

        super.putInBowl(location);

    }

    // put in microscope
    putInMicroscope(crystal: Crystal) {

        super.putInMicroscope(crystal);

    }

    // continue with the next tutorial state
    nextTutorialState() {

        switch (this.stateManager.getCurrentState()) {
            case TutorialStates.HANDS_INTRO:
                this.cleanupHandsIntro();
                this.setupHandsFlip();
                this.stateManager.nextState();
                break;
            default:
                break;
        }

    }

    setupHandsIntro() {

        // show the text
        this.textBox.showText('Welcome to the world of chirality, where nature reveals its symmetry. ' +
            'Chirality describes objects that cannot be superimposed onto their mirror images, ' +
            'like your left and right hands.');

        this.textBox.setPosition(0.05 * gameOptions.gameWidth, 0.05 * gameOptions.gameHeight);

        // show the hands
        this.handLeft.setVisible(true);
        this.handRight.setVisible(true);

        // show the continue button
        this.continue.showButton();
        this.continue.positionButton(0.80, 0.72);

    }

    cleanupHandsIntro() {

        // hide continue button
        this.continue.hideButton();

    }

    setupHandsFlip() {

        const basicText = 'Your right and left hand are mirror images. Click to flip them and try to superimpose.';
        const handTexts = [
            'Both show the back, but they do not align.',
            'Both show the inside, but they do not align.',
            'They align, but one shows the back, the other the inside.'
        ];


        // show new text
        this.textBox.showText(basicText + '\n\n' + handTexts[0]);

        // make the hand flippable
        this.handLeft.canFlip = true;
        this.handRight.canFlip = true;

        // change the text of the box every time
        this.events.on('flipped', () => {

            if (this.handLeft.front && this.handRight.front) {          // both hands show the front
                this.textBox.showText(basicText + '\n\n' + handTexts[0]);
            }
            else if (!this.handLeft.front && !this.handRight.front) {   // both hands show the back
                this.textBox.showText(basicText + '\n\n' + handTexts[1]);
            }
            else {                                                      // one hand shows the front, the other the back
                this.textBox.showText(basicText + '\n\n' + handTexts[2]);
            }

        });

        // show the continue button as soon as one hand was flipped
        this.events.once('flipped', () => {

            this.continue.showButton();

        });

    }

    cleanupHandsFlip() {

        // turn off the event handler
        this.events.off('flipped');

    }

}