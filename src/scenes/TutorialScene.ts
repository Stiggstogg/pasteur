import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {Clicks, CrystalEnantiomer, CrystalLocation, TutorialStates} from "../helper/types";
import BasicGameScene from "./BasicGameScene";
import TextBox from "../sprites/TextBox";
import TutorialStateManager from "../helper/TutorialStateManager";
import Continue from "../sprites/Continue";
import Hand from "../sprites/Hand";
import Arrow from "../sprites/Arrow";

// "Tutorial" scene: Scene for the main game
export default class GameScene extends BasicGameScene {

    private textBox!: TextBox;
    private stateManager!: TutorialStateManager;
    private handLeft!: Hand;
    private handRight!: Hand;
    private continue!: Continue;
    private thalidomide!: Phaser.GameObjects.Image;
    private tutorialCrystals!: Crystal[];
    private arrowOne!: Arrow;
    private arrowTwo!: Arrow;

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

        // create the arrows
        this.arrowOne = this.add.existing(new Arrow(this, 0.5, 0.5));
        this.arrowTwo = this.add.existing(new Arrow(this, 0.5, 0.5));

        this.arrowOne.hide();
        this.arrowTwo.hide();

    }

    // Create the crystals
    createCrystals() {

        super.createCrystals(gameOptions.numberOfCrystalsTutorial, [CrystalEnantiomer.R, CrystalEnantiomer.S, CrystalEnantiomer.R, CrystalEnantiomer.S]);

    }

    // put crystal in a bowl
    putInBowl(location: CrystalLocation): void {

        // check if you are in the SORTREMAINING state of the tutorial
        if (this.stateManager.getCurrentState() === TutorialStates.SORTREMAINING) {

            // if in the SORTREMAINING state check if the crystal is the same enantiomer as the first one in the bowl
            if (this.sameEnantiomer(super.getOpenCrystal()!, this.getCrystalInBowl(location)[0])) {

                this.textBox.showText('Well done!');
                this.textBox.positionBox(0.5 - (this.textBox.getWidth() / 2 / gameOptions.gameWidth), 0.25);

                super.putInBowl(location);

                if (super.allCrystalsSorted()) {
                    this.nextTutorialState();
                }

            }
            else {

                this.textBox.showText('No, this bowl contains the other enantiomer. Putting it here will reduce your %ee. Check again and place it in the correct bowl.');
                this.textBox.positionBox(0.05, 0.25);

                this.cameras.main.shake(200, 0.01);

                super.putBackOnTable();

            }

        }
        else {
            super.putInBowl(location);
        }

    }

    // put in microscope
    putInMicroscope(crystal: Crystal) {

        super.putInMicroscope(crystal);

    }

    // compares if two crystals are the same enantiomers
    sameEnantiomer(crystalOne: Crystal, crystalTwo: Crystal) {
        return crystalOne.enantiomer === crystalTwo.enantiomer;
    }

    // continue with the next tutorial state
    nextTutorialState() {

        switch (this.stateManager.getCurrentState()) {
            case TutorialStates.HANDS_INTRO:
                this.cleanupHandsIntro();
                this.setupHandsFlip();
                break;
            case TutorialStates.HANDS_FLIP:
                this.cleanupHandsFlip();
                this.setupResolutionIntro();
                break;
            case TutorialStates.RESOLUTION_INTRO:
                this.cleanupResolutionIntro();
                this.setupResolutionTartrate();
                break;
            case TutorialStates.RESOLUTION_TARTRATE:
                this.cleanupResolutionTartrate();
                this.setupPickCrystalOne();
                break;
            case TutorialStates.PICKCRYSTAL_ONE:
                this.cleanupPickCrystalOne();
                this.setupRotateCrystalOne();
                break;
            case TutorialStates.ROTATECRYSTAL_ONE:
                this.cleanupRotateCrystalOne();
                this.setupPickCrystalTwo();
                break;
            case TutorialStates.PICKCRYSTAL_TWO:
                this.cleanupPickCrystalTwo();
                this.setupRotateCrystalTwo();
                break;
            case TutorialStates.ROTATECRYSTAL_TWO:
                this.cleanupRotateCrystalTwo();
                this.setupPickCrystalThree();
                break;
            case TutorialStates.PICKCRYSTAL_THREE:
                this.cleanupPickCrystalThree();
                this.setupRotateCrystalThree();
                break;
            case TutorialStates.ROTATECRYSTAL_THREE:
                this.cleanupRotateCrystalThree();
                this.setupTwoCrystalsSorted();
                break;
            case TutorialStates.TWOCRYSTALSSORTED:
                this.cleanupTwoCrystalsSorted();
                this.setupSortRemaining();
                break;
            case TutorialStates.SORTREMAINING:
                this.cleanupSortRemaining();
                this.setupEnd();
                break;
            default:
                break;
        }

        this.stateManager.nextState();

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

    setupPickCrystalOne() {

        // show the text
        this.textBox.showText('Now, it is your turn to recreate Pasteur\'s historic discovery! ' +
            'In front of you are tartrate crystals in two enantiomeric forms.\n\n' +
            'Pick up the first crystal.');

        this.textBox.positionBox(0.05, 0.25);

        // show the crystals on the table (but activate only one for clicking)
        this.allCrystals.forEach((crystal) => {
            crystal.show();
            crystal.deactivateClickZone();
        });

        this.allCrystals[0].activateClickZone();

        // show the arrow to indicate the crystal
        this.arrowOne.show();
        this.arrowOne.setDirection('right');
        this.arrowOne.setRelativePosition(this.allCrystals[0].x - 0.07 , this.allCrystals[0].y);

        // go to the next state when the crystal is picked
        this.events.once(Clicks.CRYSTAL, () => {
            this.nextTutorialState();
        });

    }

    cleanupPickCrystalOne() {

        // hide the arrow
        this.arrowOne.hide();

    }

    setupRotateCrystalOne() {

        // deactivate the bowls, so that the crystal cannot be placed there
        this.bowlLeft.disableInteractive();
        this.bowlRight.disableInteractive();

        // show the first text
        this.textBox.showText('Rotate the crystal to examine its structure. ' +
            'Use your mouse, touch, or WASD/arrow keys.\n\n' +
            'Click on the microscope to place it back on the table.');

        this.textBox.positionBox(0.05, 0.6);

        // show the arrow
        this.arrowOne.show();
        this.arrowOne.setDirection('right');
        this.arrowOne.setRelativePosition(
            (this.microscope.x - this.microscope.width) / gameOptions.gameWidth - 0.04,
            (this.microscope.y + this.microscope.height / 2)/ gameOptions.gameHeight);

        // go to the next state when the microscope is clicked
        this.events.once(Clicks.MICROSCOPE, () => {
            this.nextTutorialState();
        });

    }

    cleanupRotateCrystalOne() {

        // hide the arrow
        this.arrowOne.hide();

    }

    setupPickCrystalTwo() {

        // show the text
        this.textBox.showText('Now, pick up another crystal and examine it.');

        this.textBox.positionBox(0.05, 0.37);

        // activate the second crystal for clicking and deactivate the first one
        this.allCrystals[0].deactivateClickZone();
        this.allCrystals[1].activateClickZone();

        // show the arrow to indicate the crystal
        this.arrowOne.show();
        this.arrowOne.setDirection('up');
        this.arrowOne.setRelativePosition(this.allCrystals[1].x, this.allCrystals[1].y + 0.12);

        // go to the next state when the crystal is picked
        this.events.once(Clicks.CRYSTAL, () => {
            this.nextTutorialState();
        });

    }

    cleanupPickCrystalTwo() {

        // hide the arrow
        this.arrowOne.hide();

    }

    setupRotateCrystalTwo() {

        // activate the bowls, so that the crystal cannot be placed there
        this.bowlLeft.setInteractive();
        this.bowlRight.setInteractive();

        // deactive the microscope
        this.microscope.disableInteractive();

        // show the first text
        this.textBox.showText('Examine it and place this crystal in one of the bowls to sort it out.');

        this.textBox.positionBox(0.05, 0.7);

        // show the arrows
        this.arrowOne.show();

        this.arrowOne.setDirection('left');
        this.arrowOne.setRelativePosition(
            (this.bowlLeft.x + this.bowlLeft.width / 2) / gameOptions.gameWidth + 0.04,
            (this.bowlLeft.y) / gameOptions.gameHeight);

        this.arrowTwo.show();

        this.arrowTwo.setDirection('right');
        this.arrowTwo.setRelativePosition(
            (this.bowlRight.x - this.bowlRight.width / 2) / gameOptions.gameWidth - 0.04,
            (this.bowlRight.y)/ gameOptions.gameHeight);

        // go to the next state when the crystal is placed in a bowl
        this.events.once(Clicks.BOWLLEFT, () => {
            this.nextTutorialState();
        });

        this.events.once(Clicks.BOWLRIGHT, () => {
            this.nextTutorialState();
        });

    }

    cleanupRotateCrystalTwo() {

        // hide the arrow
        this.arrowOne.hide();
        this.arrowTwo.hide();

        // turn off the event listeners for the bowls
        this.events.off(Clicks.BOWLLEFT);
        this.events.off(Clicks.BOWLRIGHT);

        // reactivate the microscope
        this.microscope.setInteractive();

    }

    setupPickCrystalThree() {

        // show the text
        this.textBox.showText('Now, pick up the first crystal again.');

        this.textBox.positionBox(0.05, 0.25);

        // Activate the first crystal for clicking
        this.allCrystals[0].activateClickZone();

        // show the arrow to indicate the crystal
        this.arrowOne.show();
        this.arrowOne.setDirection('right');
        this.arrowOne.setRelativePosition(this.allCrystals[0].x - 0.07 , this.allCrystals[0].y);

        // go to the next state when the crystal is picked
        this.events.once(Clicks.CRYSTAL, () => {
            this.nextTutorialState();
        });

    }

    cleanupPickCrystalThree() {

        // hide the arrow
        this.arrowOne.hide();

    }

    setupRotateCrystalThree() {

        // show the first text
        this.textBox.showText('This crystal is the opposite enantiomer compared to the previous one. Place it in the other bowl.');

        this.textBox.positionBox(0.05, 0.7);

        // deactivate the microscope
        this.microscope.disableInteractive();

        // show the arrows
        this.arrowOne.show();

        // check if the crystal needs to be placed in the left bowl or not (check which bowl is empty)
        const bowlLeft = this.getCrystalInBowl(CrystalLocation.BOWLLEFT)[0] === undefined;

        if (bowlLeft) {                             // next crystal needs to be placed in the left bowl

            // activate the correct bowl
            this.bowlLeft.setInteractive();         // activate the left bowl
            this.bowlRight.disableInteractive();    // deactivate the right bowl

            // place the arrow
            this.arrowOne.setDirection('left');
            this.arrowOne.setRelativePosition(
                (this.bowlLeft.x + this.bowlLeft.width / 2) / gameOptions.gameWidth + 0.04,
                (this.bowlLeft.y) / gameOptions.gameHeight);

        }
        else {

            // activate the correct bowl
            this.bowlRight.setInteractive();        // activate the right bowl
            this.bowlLeft.disableInteractive();     // deactivate the left bowl

            // place the arrow
            this.arrowOne.setDirection('right');
            this.arrowOne.setRelativePosition(
                (this.bowlRight.x - this.bowlRight.width / 2) / gameOptions.gameWidth - 0.04,
                (this.bowlRight.y)/ gameOptions.gameHeight);

        }

        // go to the next state when the crystal is placed in a bowl
        this.events.once(Clicks.BOWLLEFT, () => {
            this.nextTutorialState();
        });

        this.events.once(Clicks.BOWLRIGHT, () => {
            this.nextTutorialState();
        });

    }

    cleanupRotateCrystalThree() {

        // hide the arrow
        this.arrowOne.hide();

        // turn off the event listeners for the bowls
        this.events.off(Clicks.BOWLLEFT);
        this.events.off(Clicks.BOWLRIGHT);

        // reactivate the microscope
        this.microscope.setInteractive();

    }

    setupTwoCrystalsSorted() {

        // show the text
        this.textBox.showText('Great job! You have correctly separated your first two crystals, and both bowls now have an enantiomeric excess (ee) of 100%.\n\n' +
            'Continue sorting the rest of the crystals. I will assist you along the way.');

        this.textBox.positionBox(0.05, 0.25);

        // hide the two crystals in the bowls as they would be showing on top of the text box
        this.allCrystals[0].hide();
        this.allCrystals[1].hide();

        // Activate the remaining crystals for clicking
        this.allCrystals[2].activateClickZone();
        this.allCrystals[3].activateClickZone();

        this.events.once(Clicks.CRYSTAL, () => {

            this.nextTutorialState();

        });

    }

    cleanupTwoCrystalsSorted() {

        // hide the text box and show the crystals below it again
        this.textBox.hideText();
        this.allCrystals[0].show();
        this.allCrystals[1].show();

        // reactivate both bowls
        this.bowlRight.setInteractive();    // activate the right bowl
        this.bowlLeft.setInteractive();     // deactivate the left bowl

    }

    setupSortRemaining() {

        // hide text box when you click a crystal
        this.events.on(Clicks.CRYSTAL, () => {

            this.textBox.hideText();

        });


    }

    cleanupSortRemaining() {

        this.events.off(Clicks.CRYSTAL);

    }

    setupEnd() {

        // show the text
        this.textBox.showText('Great! You have sorted all crystals! ' +
            'Now it is time to start a real game on your own. ' +
            'Aim to ensure each bowl contains only one enantiomer (100 %ee). ' +
            'Successfully sort all the crystals to complete the task!\n\n' +
            'Your score will be based on the accuracy of your separation (%ee) ' +
            'and the time it takes to complete the task — faster and more precise sorting earns higher points.');

        this.textBox.positionBox(0.05, 0.07);

        // cleanup the three scene (hide all crystals)
        super.cleanupScene();

        // show the continue button
        this.continue.changeText('Finish Tutorial >>');
        this.continue.showButton();
        this.continue.positionButton(0.7, 0.72);

        // go back to the menu scene when the button is clicked
        this.continue.once('continue', () => {

            // fade out the sceen
            this.cameras.main.fadeOut(gameOptions.fadeInOutTime);   // fade out the screen

            // fade out the music
            this.tweens.add({
                targets: this.soundtrack,
                volume: 0,
                duration: gameOptions.fadeInOutTime
            });

            this.cameras.main.once('camerafadeoutcomplete', () => {                                 // change the scene when the screen is faded out
                this.scene.start('Home');
            });
        });

    }

}