import gameOptions from "../helper/gameOptions";
import Crystal from "../sprites/Crystal";
import {CrystalLocation} from "../helper/types";
import BasicGameScene from "./BasicGameScene";
import TextBox from "../sprites/TextBox";

// "Tutorial" scene: Scene for the main game
export default class GameScene extends BasicGameScene {

    private textBox!: TextBox;

    // Constructor
    constructor() {
        super('Tutorial', 'soundtrackTutorial');
    }

    // Creates all objects of this scene
    create(): void {

        // execute the create function of the parent class
        super.create();

        // create the crystals
        //this.createCrystals();

        this.textBox = this.add.existing(new TextBox(this));

        this.textBox.showText('Welcome to the world of chirality, where nature reveals its symmetry. ' +
            'Chirality describes objects that cannot be superimposed onto their mirror images, ' +
            'like your left and right hands.');

        this.textBox.setPosition(0.05 * gameOptions.gameWidth, 0.05 * gameOptions.gameHeight);

        this.add.image(0.6 * gameOptions.gameWidth, 0.5 * gameOptions.gameHeight, 'hand');
        //this.add.image(0.4 * gameOptions.gameWidth, 0.5 * gameOptions.gameHeight, 'hand').setFlip(true, false);
        this.add.image(0.4 * gameOptions.gameWidth, 0.5 * gameOptions.gameHeight, 'handBack');

    }

    // Update function for the game loop.
    update(_time: number, _delta: number): void {       // remove underscore if time and delta is needed

        // execute the update function of the parent class
        super.update(_time, _delta);

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

}