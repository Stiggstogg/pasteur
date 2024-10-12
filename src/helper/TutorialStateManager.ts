import {TutorialStates} from "./types";

export default class TutorialStateManager {

    private listOfStates: TutorialStates[] = [
        TutorialStates.HANDS_INTRO,
        TutorialStates.END
    ];
    private currentState: number = 0;

    constructor() {

    }

    // get the current state
    public getCurrentState(): TutorialStates {
        return this.listOfStates[this.currentState];
    }

    // go to the next state
    public nextState(): void {
        this.currentState++;
    }

}