export enum ELearningMethod {
    METHOD_FLASH_CARD = "METHOD_FLASH_CARD",
    METHOD_MULTIPLE_CHOICE = "METHOD_MULTIPLE_CHOICE",
    METHOD_TYPING = "METHOD_TYPING",
}

export const stringToELearningMethod = (value: string): ELearningMethod | undefined => {
    switch (value) {
        case "METHOD_FLASH_CARD":
            return ELearningMethod.METHOD_FLASH_CARD;
        case "METHOD_MULTIPLE_CHOICE":
            return ELearningMethod.METHOD_MULTIPLE_CHOICE;
        case "METHOD_TYPING":
            return ELearningMethod.METHOD_TYPING;
        default:
            return undefined;
    }
};
