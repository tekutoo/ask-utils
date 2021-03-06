import { HandlerInput } from 'ask-sdk'
import { Request, Slot } from 'ask-sdk-model'
import { getRequest, isIntentRequestType } from './intentHandler'
type resolutionSlot = {
    synonym: string;
    resolved: string;
    isValidated: boolean;
} | ''
export const getSlot = (handlerInput: HandlerInput, slotName: string): Slot | '' => {
    const request: Request = getRequest(handlerInput)
    if (!isIntentRequestType(request)) return ''
    if (
        request &&
    request.intent &&
    request.intent.slots &&
    request.intent.slots[slotName] &&
    request.intent.slots[slotName].value
    ) {
        return request.intent.slots[slotName]
    }
    return ''
}
export const getResolutionSlot = (slot: Slot): resolutionSlot => {
    if (!slot) return ''
    const value = slot.value || ''
    if (
        slot.resolutions &&
        slot.resolutions.resolutionsPerAuthority &&
        slot.resolutions.resolutionsPerAuthority[0] &&
        slot.resolutions.resolutionsPerAuthority[0].status &&
        slot.resolutions.resolutionsPerAuthority[0].status.code
    ) {
        switch (slot.resolutions.resolutionsPerAuthority[0].status.code) {
            case 'ER_SUCCESS_MATCH':
                return {
                    synonym: value,
                    resolved: slot.resolutions.resolutionsPerAuthority[0].values[0].value.name,
                    isValidated: true
                }
            case 'ER_SUCCESS_NO_MATCH':
                return {
                    synonym: value,
                    resolved: value,
                    isValidated: false
                }
            default:
                return ''
        }
    } else {
        return {
            synonym: value,
            resolved: value,
            isValidated: false
        }
    }
}

export const getSlotValue = (handlerInput: HandlerInput, slotName: string): string => {
    const slot = getSlot(handlerInput, slotName)
    if (!slot) return ''
    const resolution = getResolutionSlot(slot)
    if (!resolution) return slot.value || ''
    return resolution.resolved
}
