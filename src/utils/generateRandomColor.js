// Для упрощения, цвет домена одновременно является и идентификатором
// По этой причине, каждый новый цвет генерируется уникальным
// Если в приложении будет возможным наличие более 16млн доменов, то произойдет бесконечная рекурсия, коллапс и сжатие в черную дыру
export const generateRandomColor = (existingColors) => {
    const randomNum = () => Math.floor(Math.random() * 256);
    const color = `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
    return existingColors.includes(color) ? generateRandomColor(existingColors) : color;
}