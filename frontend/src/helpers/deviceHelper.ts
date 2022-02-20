const isMobile = /Mobi/.test(navigator.userAgent)

export function isTouchDevice() {
    return isMobile && ('ontouchstart' in window || navigator.maxTouchPoints)
}