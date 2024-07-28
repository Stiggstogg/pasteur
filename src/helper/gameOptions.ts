// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

import {MinMax} from "./types";

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly textStyles: Phaser.Types.GameObjects.Text.TextStyle[];
    public readonly weightRange: MinMax;
    public readonly lineWidth: number;
    public readonly lineColor: number;
    public readonly lineAlpha: number;
    public readonly faceColor: number;
    public readonly faceAlpha: number;
    public readonly zCrystalTable: number;
    public readonly zCrystalMicroscope: number;
    public readonly zCrystalBowl: number;
    public readonly crystalClickAreaSize: number;
    public readonly numberOfCrystals: number;
    public readonly crystalTableStart: {x: number, y: number};
    public readonly crystalTableDistance: number;
    public readonly dragSensitivity: number;
    public readonly crystalScaling: number;
    public readonly bowlLeftPosition: {x: number, y: number};
    public readonly bowlRightPosition: {x: number, y: number};
    public readonly bowlCrystalSpread: number;
    public readonly happyFaceLimit: number;
    public readonly sadFaceLimit: number;
    public readonly parTime: number;
    public readonly scoreMultiplier: number;
    public readonly keyboardRotationSpeed: number;

    constructor() {

        // ---------------------
        // Game and world area
        // ---------------------

        // Width and height of the game (canvas)
        this.gameWidth = 425;
        this.gameHeight = 240;

        // ---------------------
        // Text styles
        // ---------------------

        this.textStyles = [];

        // Text style 0: Title
        this.textStyles.push({
            fontFamily: 'Orbitron',
            fontSize: '100px',
            color: '#FFE500',
            fontStyle: 'bold'
        });

        // ------------------------
        // Bowls
        // ------------------------

        this.bowlLeftPosition = {x: 0.17, y: 0.53};                       // position of the left bowl (relative to the game width and height)
        this.bowlRightPosition = {x: 0.85, y: this.bowlLeftPosition.y};     // position of the right bowl (relative to the game width and height)
        this.bowlCrystalSpread = 0.03;                                     // spread of the crystals in the bowl (relative to the game width)

        // ------------------------
        // Crystal style
        // ------------------------

        this.lineWidth = 1;                 // line width of the edges
        this.lineColor = 0x000000;          // color of the faces and lines
        this.lineAlpha = 0.5;               // alpha value of the line
        this.faceColor = 0xFFFFFF;          // color of the face
        this.faceAlpha = 0.5;               // alpha of the face

        // ------------------------
        // Crystal position in 3D
        // ------------------------

        this.zCrystalTable = -50;
        this.zCrystalMicroscope = 0;
        this.zCrystalBowl = -80;

        // ------------------------
        // Other crystal options
        // ------------------------

        this.weightRange = {min: 0.75, max: 1.25};              // range for the weight (the average value should by always one, as this is also used to scale the crystal, together with the scaling!)
        this.crystalScaling = 3;                                // defines the size of the crystal (crystal coordinates are multiplied by this value)
        this.crystalClickAreaSize = 0.1;                        // relative (to game width) size of the clickable area around the crystal
        this.numberOfCrystals = 12;                             // number of crystals on the table
        this.crystalTableStart = {                              // start position of the crystals on the table (relative position)
            x: 0.3,
            y: 0.15
        };
        this.crystalTableDistance =  0.13;   // distance between the crystals on the table (relative distance to game width)
        this.dragSensitivity = Math.PI;      // sensitivity which is used to determine the dragging speed, unit rad / game.width (how many radians should the crytal rotate if the mouse is moved from left edge of the canvas to the right edge)

        // ------------------------
        // Face limits
        // ------------------------
        this.happyFaceLimit = 70;           // if the average %ee is higher than this then the happy face is shown
        this.sadFaceLimit = 30;             // if the average %ee is lower than this then the sad face is shown

        // ------------------------
        // Scoring parameters
        // ------------------------
        this.parTime = 30;                  // time in seconds which is used to calculate the factor for the score, if the player is faster than this time, the multiplier is > 1
        this.scoreMultiplier = 1000;             // multiplier for the score which is used to make the number higher and look better :)

        // ------------------------
        // Keyboard controls
        // ------------------------
        this.keyboardRotationSpeed = 0.05;   // speed of the rotation when the keyboard is used (in radians per frame)

    }

}

export default new GameOptions();