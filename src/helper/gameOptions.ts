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
    public readonly tableCrystalSize: number;
    public readonly microscopeCrystalSize: number;

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

        // ------------------------
        // Crystal style
        // ------------------------

        this.lineWidth = 1;                 // line width of the edges
        this.lineColor = 0x666666;          // color of the faces and lines
        this.lineAlpha = 0.5;               // alpha value of the line
        this.faceColor = 0xFFFFFF;          // color of the face
        this.faceAlpha = 0.5;               // alpha of the face
        this.tableCrystalSize = 47;         // size of the table crystal // TODO: Change back to 10 after testing
        this.microscopeCrystalSize = 47;    // size of the microscope crystal
    }

}

export default new GameOptions();