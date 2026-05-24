import {TutorialStates} from "./types";

export default class TutorialStateManager {

    private listOfStates: TutorialStates[] = [
        TutorialStates.HANDS_INTRO,
        TutorialStates.HANDS_FLIP,
        TutorialStates.RESOLUTION_INTRO,
        TutorialStates.RESOLUTION_TARTRATE,
        TutorialStates.PICKCRYSTAL_ONE,
        TutorialStates.ROTATECRYSTAL_ONE,
        TutorialStates.PICKCRYSTAL_TWO,
        TutorialStates.ROTATECRYSTAL_TWO,
        TutorialStates.PICKCRYSTAL_THREE,
        TutorialStates.ROTATECRYSTAL_THREE,
        TutorialStates.TWOCRYSTALSSORTED,
        TutorialStates.SORTREMAINING,
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