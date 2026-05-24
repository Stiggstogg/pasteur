import { Events } from 'phaser';

// Events center to pass on information between objects and scenes
const eventsCenter = new Events.EventEmitter();

export default eventsCenter;