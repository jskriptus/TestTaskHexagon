import { OFFSET_HEX_X, OFFSET_HEX_Y } from '../constants'

export const generateGrid = (size) => {
  let grid = [];

  const cutCount = size.L - 1; // количество обрезаемых гексагонов
  const rowsCount = cutCount + size.M; // количество строк 
  const columnsCount = cutCount + size.N; // количество стобцов

  for (let row = 0; row < rowsCount; row++) {
    for (let column = 0; column < columnsCount; column++) {
      if (column >= cutCount - row && column < columnsCount - (cutCount + 1 - rowsCount + row)) {
        const x = column * OFFSET_HEX_X + (row * OFFSET_HEX_X) / 2;
        const y = (row * OFFSET_HEX_Y * 3) / 4 + OFFSET_HEX_Y / 2;
        const id = String(grid.length + 1);
        grid = [...grid, { id, row, column, x, y, domainColor: undefined }];
      }
    }
  }

  return grid;
};
