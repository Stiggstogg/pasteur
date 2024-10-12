import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {CrystalEnantiomer, CrystalLocation, TutorialStates} from "../helper/types";
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
    private thalidomide!: Phaser.GameObjects.Image;
    private tutorialCrystals!: Crystal[];

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

        // create the game crystals
        this.createCrystals();

        this.allCrystals.forEach((crystal) => {     // make them invisible
            crystal.hide();
        });

        // create two crystals for the tutorial
        this.tutorialCrystals = [];

        this.tutorialCrystals.push(new Crystal(this.threeScene, this, this.threeCamera, 0.5, 0.5,
            gameOptions.weightRange.min, CrystalEnantiomer.R, true));
        this.tutorialCrystals.push(new Crystal(this.threeScene, this, this.threeCamera, 0.5, 0.5,
            gameOptions.weightRange.min, CrystalEnantiomer.S, true));

        this.tutorialCrystals[0].moveCrystal(-2, -0.4);
        this.tutorialCrystals[1].moveCrystal(2, -0.4);

        this.tutorialCrystals[0].rotate(-0.8, -0.3);
        this.tutorialCrystals[1].rotate(-0.8, 0.3);

        this.tutorialCrystals.forEach((crystal) => {
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

        // create the thalidomide molecule
        this.thalidomide = this.add.image(0.5 * gameOptions.gameWidth, 0.53 * gameOptions.gameHeight, 'thalidomide').setVisible(false).setScale(0.07);

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
            case TutorialStates.HANDS_FLIP:
                this.cleanupHandsFlip();
                this.setupResolutionIntro();
                this.stateManager.nextState();
                break;
            case TutorialStates.RESOLUTION_INTRO:
                this.cleanupResolutionIntro();
                this.setupResolutionTartrate();
                this.stateManager.nextState();
                break;
            case TutorialStates.RESOLUTION_TARTRATE:
                this.cleanupResolutionTartrate();
                this.setupHowto();
                this.stateManager.nextState();
                break;
            case TutorialStates.HOWTO:
                this.cleanupHowto();
                //this.setupHowto(); TODO: Add next state
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

        this.textBox.positionBox(0.05, 0.05);

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

        // remove the hands
        this.handRight.setVisible(false);
        this.handLeft.setVisible(false);

        // hide the continue button
        this.continue.hideButton();

    }

    setupResolutionIntro() {

        // show the text and the thalodomine molecule
        this.textBox.showText('In chemistry, molecules that cannot be superimposed on their mirror images are called enantiomers. ' +
            'In nature, often only one enantiomer is present, and they can behave differently. ' +
            'For example, one form of thalidomide ("Contergan" / "Softenon") treats morning sickness, while the other caused birth defects.' +
            '\n\n\n\n\n\n\n' +
            'Classical chemical processes produce a 50/50 mixture of chiral molecules. Even today, separating enantiomers remains a significant challenge.');

        // show the thalidomide molecule
        this.thalidomide.setVisible(true);

        // show the continue button
        this.continue.positionButton(0.80, 0.90);
        this.continue.showButton();

    }

    cleanupResolutionIntro() {

        // hide the thalidomide molecule
        this.thalidomide.setVisible(false);

        // hide the continue button
        this.continue.hideButton();

    }

    setupResolutionTartrate() {

        // show the text about the tartrate and its history
        this.textBox.showText('In 1848, Louis Pasteur became the first to achieve chiral resolution when he sorted tartrate crystals by hand. ' +
            'He discovered that some crystals were left-handed while others were right-handed, ' +
            'providing the first proof of molecular chirality and change the course of science forever.' +
            '\n\n\n\n\n\n\n\n ');

        // show two big crystals
        this.tutorialCrystals.forEach((crystal) => {
            crystal.show();
            crystal.deactivateClickZone();          // needs to be disabled as show() enables it
        });

        // show the continue button
        this.continue.positionButton(0.80, 0.80);
        this.continue.showButton();

    }

    cleanupResolutionTartrate() {

        // hide the tutorial crystals
        this.tutorialCrystals.forEach((crystal) => {
            crystal.hide();
        });

        // hide the continue button
        this.continue.hideButton();

    }

    setupHowto() {

        // show the first text
        this.textBox.showText('Now, it is your turn to recreate Pasteur\'s historic discovery! ' +
            'In front of you are tartrate crystals in two enantiomeric forms. Pick up the first crystal.');

        this.textBox.positionBox(0.05, 0.25);

        // show the crystals on the table (but activate only one for clicking)
        this.allCrystals.forEach((crystal) => {
            crystal.show();
            crystal.deactivateClickZone();
        });

        this.allCrystals[0].activateClickZone();




    }

    cleanupHowto() {

    }

}