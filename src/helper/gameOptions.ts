// CONFIGURABLE GAME OPTIONS
// changing these values will affect gameplay

class GameOptions {

    public readonly gameWidth: number;
    public readonly gameHeight: number;
    public readonly textStyles: Phaser.Types.GameObjects.Text.TextStyle[];

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

    }

}

export default new GameOptions();