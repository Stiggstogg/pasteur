// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay
import { Types } from "phaser";
import {MinMax} from "./types";

type GameOptions = {
    readonly textColorTutorial: number;
    readonly weightRange: MinMax;
    readonly lineWidth: number;
    readonly lineColor: number;
    readonly lineAlpha: number;
    readonly faceColor: number;
    readonly faceAlpha: number;
    readonly zCrystalTable: number;
    readonly zCrystalMicroscope: number;
    readonly zCrystalBowl: number;
    readonly crystalClickAreaSize: number;
    readonly numberOfCrystals: number;
    readonly crystalTableStart: {x: number, y: number};
    readonly crystalTableDistance: number;
    readonly dragSensitivity: number;
    readonly numberOfCrystalsTutorial: number;
    readonly crystalScaling: number;
    readonly bowlLeftPosition: {x: number, y: number};
    readonly bowlRightPosition: {x: number, y: number};
    readonly bowlCrystalSpread: number;
    readonly happyFaceLimit: number;
    readonly sadFaceLimit: number;
    readonly parTime: number;
    readonly scoreMultiplier: number;
    readonly keyboardRotationSpeed: number;
    readonly fadeInOutTime: number;
    readonly soundtrackVolume: number;
    readonly shakeDuration: number;
    readonly shakeIntensity: number;

}

const gameOptions: GameOptions = {

    // ---------------------
    // Fade in and out times
    // ---------------------

    fadeInOutTime: 500,      // fade in and out time in milliseconds (for scene transitions)

    // ---------------------
    // Sound options
    // ---------------------

    soundtrackVolume: 0.5,    // volume of the soundtrack


    // ---------------------
    // Text styles
    // ---------------------

    textColorTutorial: 0xE1E2A8,   // color of the tutorial text

    // ------------------------
    // Bowls
    // ------------------------

    bowlLeftPosition: {x: 0.17, y: 0.53},                       // position of the left bowl (relative to the game width and height)
    bowlRightPosition: {x: 0.85, y: 0.53},     // position of the right bowl (relative to the game width and height)
    bowlCrystalSpread: 0.03,                                     // spread of the crystals in the bowl (relative to the game width)

    // ------------------------
    // Crystal style
    // ------------------------

    lineWidth: 1,                 // line width of the edges
    lineColor: 0x000000,          // color of the faces and lines
    lineAlpha: 0.5,               // alpha value of the line
    faceColor: 0xFFFFFF,          // color of the face
    faceAlpha: 0.5,               // alpha of the face

    // ------------------------
    // Crystal position in 3D
    // ------------------------

    zCrystalTable: -50,
    zCrystalMicroscope: 0,
    zCrystalBowl: -80,

    // ------------------------
    // Other crystal options
    // ------------------------

    weightRange: {min: 0.75, max: 1.25},              // range for the weight (the average value should by always one, as this is also used to scale the crystal, together with the scaling!)
    crystalScaling: 3,                                // defines the size of the crystal (crystal coordinates are multiplied by this value)
    crystalClickAreaSize: 0.1,                        // relative (to game width) size of the clickable area around the crystal
    numberOfCrystals: 12,                             // number of crystals on the table
    crystalTableStart: {                              // start position of the crystals on the table (relative position)
        x: 0.3,
        y: 0.15
    },
    crystalTableDistance:  0.13,   // distance between the crystals on the table (relative distance to game width)
    dragSensitivity: Math.PI,      // sensitivity which is used to determine the dragging speed, unit rad / game.width (how many radians should the crytal rotate if the mouse is moved from left edge of the canvas to the right edge)

    // ------------------------
    // Tutorial options
    // ------------------------

    numberOfCrystalsTutorial: 4,   // number of crystals in the tutorial

    // ------------------------
    // Animation options
    // ------------------------

    shakeDuration: 200,           // duration of the shake animation in milliseconds
    shakeIntensity: 0.01,         // intensity of the shake animation

    // ------------------------
    // Face limits
    // ------------------------

    happyFaceLimit: 70,           // if the average %ee is higher than this then the happy face is shown
    sadFaceLimit: 30,             // if the average %ee is lower than this then the sad face is shown

    // ------------------------
    // Scoring parameters
    // ------------------------

    parTime: 30,                  // time in seconds which is used to calculate the factor for the score, if the player is faster than this time, the multiplier is > 1
    scoreMultiplier: 1000,             // multiplier for the score which is used to make the number higher and look better :)

    // ------------------------
    // Keyboard controls
    // ------------------------
    keyboardRotationSpeed: 0.05,   // speed of the rotation when the keyboard is used (in radians per frame)

}

export default gameOptions;