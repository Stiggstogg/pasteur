// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

import {CoordinateMinMax, MinMax} from "./types";

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly textStyles: Phaser.Types.GameObjects.Text.TextStyle[];
    public readonly weightRange: MinMax;
    public readonly tableRange: CoordinateMinMax;
    public readonly lineWidth: number;
    public readonly lineColor: number;
    public readonly lineAlpha: number;
    public readonly faceColor: number;
    public readonly faceAlpha: number;
    public readonly zCrystalTable: number;
    public readonly zCrystalMicroscope: number;
    public readonly crystalClickAreaSize: number;
    public readonly numberOfCrystals: number;
    public readonly crystalTableStart: {x: number, y: number};
    public readonly crystalTableDistance: number;
    public readonly dragSensitivity: number;

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
        // Crystal boundaries
        // ------------------------

        this.weightRange = {min: 0.75, max: 1.25};                              // range for the weight
        this.tableRange = {minX: 0.28, maxX: 0.72, minY: 0.06, maxY: 0.58};    // range where crystals are placed on the table
        this.tableRange = {minX: 0.5, maxX: 0.5, minY: 0.35, maxY: 0.35};         // TODO: Remove, this is just for testing

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

        // ------------------------
        // Other crystal options
        // ------------------------

        this.crystalClickAreaSize = 0.1;    // relative (to game width) size of the clickable area around the crystal
        this.numberOfCrystals = 10;         // number of crystals on the table
        this.crystalTableStart = {          // start position of the crystals on the table (relative postion)
            x: 0.3,
            y: 0.15
        };
        this.crystalTableDistance =  0.13;   // distance between the crystals on the table (relative distance to game width)
        this.dragSensitivity = 0.50;         // relative sensitivity (to game width) which is used to determine the dragging speed (this value corresponds to one degree of rotation)

    }

}

export default new GameOptions();