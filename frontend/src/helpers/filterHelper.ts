export const compareText = (leftText: string, rightText: string) => {
    return leftText.toLocaleLowerCase().indexOf(rightText.toLocaleLowerCase()) !== -1
}