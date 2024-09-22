import Phaser from 'phaser';
import gameOptions from "../helper/gameOptions";

// "Home" scene: Main game menu scene
export default class HomeScene extends Phaser.Scene {

    private menuEntries!: string[];
    private inactiveStyle!: Phaser.Types.GameObjects.Text.TextStyle;
    private activeStyle!: Phaser.Types.GameObjects.Text.TextStyle;
    private selected!: number;
    private items!: Phaser.GameObjects.Text[];
    private fading!: boolean;
    private soundtrack!: Phaser.Sound.WebAudioSound;

    // Constructor
    constructor() {
        super({
            key: 'Home'
        });
    }

    // Initialize parameters
    init(): void {

        // menu entries
        this.menuEntries = [
            'Start',
            'How to Play',
            'Credits'
        ];

        this.inactiveStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000',
            fontStyle: '',
        }

        this.activeStyle = {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ff0000',
            fontStyle: 'bold',
        }

        // initialize empty parameters
        this.selected = 0;
        this.items = [];

        // initialize fading
        this.fading = false;

    }

    // Shows the home screen and waits for the user to select a menu entry
    create(): void {

        // fade in
        this.cameras.main.fadeIn(gameOptions.fadeInOutTime);

        // Background
        this.add.image(0, 0, 'title').setOrigin(0);

        // Create the menu with its entries
        this.createMenu(this.menuEntries);

        // Add keyboard inputs
        this.addKeys();

        // Start the music
        this.startMusic();

    }

    // Creates the menu with its entries, sets the styles for it and adds the mouse events
    createMenu(menuEntries: string[]): void {

        // start position and y space between the entries
        const start = {x: gameOptions.gameWidth * 0.03, y: gameOptions.gameHeight * 0.6};      // start position
        const ySpace = gameOptions.gameHeight * 0.13;                                         // ySpace between the entries

        // create menu items (loop through each item)
        for (let i = 0;i < menuEntries.length; i++) {

            const item = this.add.text(start.x, start.y + i * ySpace, menuEntries[i]).setOrigin(0, 0.5);

            item.setInteractive();          // set interactive

            item.on(Phaser.Input.Events.POINTER_OVER, function(this: HomeScene) : void {        // set event action for mouse over (selecting it)
                this.selectSpecific(i);
            }, this);

            item.on(Phaser.Input.Events.POINTER_DOWN, function(this: HomeScene) : void {        // set event action for pointer down (clicking it with the mouse)
                this.selectSpecific(i);          // select the entry (if not already)
                this.spaceEnterKey();           // click it
            }, this);

            this.items.push(item);
        }

        this.highlightSelected();         // highlight the selected entry
    }

    // Select the next menu entry (when clicking down)
    selectNext(): void {

        if (!this.fading) {
            // select the next, or if it is the last entry select the first again
            if (this.selected >= this.items.length - 1) {
                this.selected = 0;              // select the first entry
            }
            else {
                this.selected++;                // select the previous entry
            }

            // highlight the selected entry
            this.highlightSelected();

            // play the select sound
            this.sound.play('select');
        }
    }

    // Select the previous menu entry (when clicking up)
    selectPrevious(): void {

        if (!this.fading) {
            // select the previous, or if it is the first entry select the last again
            if (this.selected <= 0) {
                this.selected = this.items.length -1;   // select the last entry
            }
            else {
                this.selected--;                        // select the previous entry
            }

            // highlight the selected entry
            this.highlightSelected();

            // play the select sound
            this.sound.play('select');
        }

    }

    // Select specific menu entry (when moving with the mouse over it)
    selectSpecific(itemIndex: number): void {

        if (!this.fading) {
            this.selected = itemIndex;

            // highlight the selected entry
            this.highlightSelected();

            // play the select sound
            this.sound.play('select');
        }

    }

     // Highlights the selected entry (changing the styles of the deselected and selected entries)
    highlightSelected(): void {

        for (let i in this.items) {
            this.items[i].setStyle(this.inactiveStyle);         // change the style of all entries to the inactive style
        }

        this.items[this.selected].setStyle(this.activeStyle);   // change the style of the selected entry to the active style

    }

     // Add keyboard input to the scene.
    addKeys(): void {

        // up and down keys (moving the selection of the entries)
        this.input.keyboard!.addKey('Down').on('down', function(this: HomeScene) { this.selectNext() }, this);
        this.input.keyboard!.addKey('S').on('down', function(this: HomeScene) { this.selectNext() }, this);
        this.input.keyboard!.addKey('Up').on('down', function(this: HomeScene) { this.selectPrevious() }, this);
        this.input.keyboard!.addKey('W').on('down', function(this: HomeScene) { this.selectPrevious() }, this);

        // enter and space key (confirming a selection)
        this.input.keyboard!.addKey('Enter').on('down', function(this: HomeScene) { this.spaceEnterKey() }, this);
        this.input.keyboard!.addKey('Space').on('down', function(this: HomeScene) { this.spaceEnterKey() }, this);

    }

    // Action which happens when the enter or space key is pressed.
    spaceEnterKey() {

        if (!this.fading) {

            this.sound.play('click');        // play the click sound

            switch(this.selected) {
                case 0:                 // start the game when the first entry is selected ("Start") (after fading out)

                    // fade out the screen      TODO: Put this before the switch as soon as HowTo and Credits are implemented
                    this.cameras.main.fadeOut(gameOptions.fadeInOutTime);
                    this.fading = true;         // set fading to true

                    // fade out the music
                    this.tweens.add({
                        targets: this.soundtrack,
                        volume: 0,
                        duration: gameOptions.fadeInOutTime
                    });

                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('Game');
                        this.soundtrack.stop();         // stop the soundtrack
                    });

                    break;
                case 1:                 // start the "Howto" scene when the "How To Play" entry is selected (after fading out)
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        console.log("HowTo");
                    });
                    break;
                case 2:                 // start the "Credits" scene when the "How To Play" entry is selected (after fading out)
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        console.log("Credits");
                    });
                    break;
            }

        }

    }

    // start the music
    startMusic() {
        this.soundtrack = this.sound.add('soundtrackMenu') as Phaser.Sound.WebAudioSound;

        this.soundtrack.play({
            loop: true,
            volume: 0
        });

        // fade in the music
        this.tweens.add({
            targets: this.soundtrack,
            volume: this.soundtrack.volume,    // TODO: Remove after testing
            duration: gameOptions.fadeInOutTime
        });

    }

}