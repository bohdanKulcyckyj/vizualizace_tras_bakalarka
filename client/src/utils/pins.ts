import { PIN_TYPE } from "../interfaces/dashboard/MapModel";

export const getPinTitle = (pinType: PIN_TYPE): string => {
    switch(pinType) {
        case PIN_TYPE.PIN_IMAGE:
            return 'Image'
        case PIN_TYPE.PIN_LABEL:
            return 'Label'
        case PIN_TYPE.PIN_SIGN:
            return 'Pin'
    }
} 