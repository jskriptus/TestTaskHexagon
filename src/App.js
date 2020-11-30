import React, { useState, useEffect } from "react";
import GridSizeForm from "./components/GridSizeForm";
import Chance from "./components/Chance";
import DomainsResult from "./components/DomainsResult";
import Content from "./components/Content";
import ResultTable from "./components/ResultTable";
import { Layout, Drawer } from "antd";
import { TABLE_ROWS_LIMIT, HEX_NEIGHBORS_COUNT } from "./constans";
import { generateGrid, generateRandomColor } from "./utils";

export default function App() {
  const { Header } = Layout;
  const initGrid = {
    hexes: [],
    domains: [],
  };
  const [gridSize, setGridSize] = useState({}); // размеры сетки
  const [gridState, setGridState] = useState(initGrid); // гексагоны и домены (состояние сетки)
  const { hexes, domains } = gridState;
  const [calcs, setCalcs] = useState([]); // расчеты доменов для таблицы
  const [chanceAtAutoCheck, setChanceAtAutoCheck] = useState(undefined); // вероятность для произведения расчета после автоматического заполнения сетки
  const [visibleTable, setVisibleTable] = useState(false); // видимость таблицы с результатами

  useEffect(() => {
    // Генерация сетки гексагонов при внесении изменений в размер сетки
    changeGridState(generateGrid(gridSize));
  }, [gridSize]);

  useEffect(() => {
    // производим расчет доменов
    if (chanceAtAutoCheck) {
      calculateDomains(chanceAtAutoCheck);
      setChanceAtAutoCheck(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridState]);

  const showTable = () => setVisibleTable((visibility) => !visibility);

  const changeGridState = (gridHexes) => {
    // при изменении состояния гексагонов определяет перечень уникальных доменов
    const newDomains = gridHexes.reduce((acc, h) => {
      
      return acc.includes(h.domainColor) || !h.domainColor ? acc : [...acc, h.domainColor];
    }, []);

    const newGridState = {
      hexes: gridHexes,
      domains: newDomains,
    };

    setGridState(newGridState);
  }

  const autoCheckHexes = (chance) => {
    // Очищаем сетку
    const clearHexes = hexes
      .map((h) => ({ ...h, domainColor: undefined }));
    // Присваивание доменов для гексагонов с заданной вероятностью
    const randomHexes = clearHexes
      .filter(() => Math.random() <= chance);

    setChanceAtAutoCheck(chance);
    mergeDomainsGroup(randomHexes, clearHexes);
  };

  // Определяем соседние гексагоны
  const findNeighbors = (hex, gridHexes) => {
    const neightbors = gridHexes.filter(i => {
      const isTopRightNeightbor = i.row - 1 === hex.row && hex.column === i.column + 1;
      const isMiddleRightNeightbor = i.row === hex.row && hex.column === i.column + 1;
      const isBottomRightNeightbor = i.row - 1 === hex.row && hex.column === i.column;
      const isBottomLeftNeightbor = i.row + 1 === hex.row && hex.column === i.column - 1;
      const isMiddleLeftNeightbor = i.row === hex.row && hex.column === i.column - 1;
      const isTopLeftNeightbor = i.row + 1 === hex.row && hex.column === i.column;

      return ((
        i.id !== hex.id
      ) && (
          isTopRightNeightbor ||
          isMiddleRightNeightbor ||
          isBottomRightNeightbor ||
          isBottomLeftNeightbor ||
          isMiddleLeftNeightbor ||
          isTopLeftNeightbor
        )
      )
    })

    return neightbors;
  }

  // Определяем домены в которых состоят соседи
  const findNeighborsDomains = (neightbors) => {
    return neightbors.reduce((acc, n) => {
      return acc.includes(n.domainColor) || !n.domainColor ? acc : [...acc, n.domainColor];
    }, []);
  }

  const selectHex = (id) => {
    // Находим гексагон по Id
    const hex = hexes.find((h) => id === h.id);

    if (hex && hex.domainColor) {
      splitDomain(hex, hexes)
    } else if (hex) {
      const newGrid = mergeDomains(hex, hexes);
      changeGridState(newGrid);
    }
  };

  const splitDomain = (hex, gridHexes) => {
    const unchekedHexId = hex.id;

    // Определяем гексогоны которые входят в состав разделяемого домена
    const domainHexes = gridHexes
      .filter((h) => h.domainColor === hex.domainColor && h.id !== unchekedHexId);
    const domainHexesIds = domainHexes.map((h) => h.id);

    // Убираем домен у гексагонов которые входят в состав разделяемого домена
    const gridWithoutDomain = gridHexes.map((h) =>
      domainHexesIds.includes(h.id) || h.id === unchekedHexId ? { ...h, domainColor: undefined } : h);

    // Определяем новый домен(ы) для исключенных гексагонов
    mergeDomainsGroup(domainHexes, gridWithoutDomain);
  }

  // Определяет в какой домен (в новый или в соседний) нужно включить гексагон и если требуется, то менять домен (цвет) у соседей
  const mergeDomains = (hex, gridHexes) => {
    // Определяем перечень доменов в которые входят соседи
    const neightbors = findNeighbors(hex, gridHexes);
    const neightborsDomains = findNeighborsDomains(neightbors);

    // Определяем новый уникальный цвет для домена
    const newDomainColor = generateRandomColor(domains);

    let newGrid = gridHexes;

    // Если соседей нет, то включаем гексагон в новый домен
    // Если сосед один, то включаем гексагон в домен соседа
    const domainColor = neightborsDomains.length && neightborsDomains.length === 1
      ? neightborsDomains[0]
      : newDomainColor;
    newGrid = gridHexes.map((h) => {
      return hex.id === h.id ? { ...h, domainColor } : h;
    })

    // Если есть более одного соседа, то включаем их в новый домен
    if (neightborsDomains.length > 1) {
      newGrid = newGrid.map((h) => {
        return neightborsDomains.includes(h.domainColor) ? { ...h, domainColor: newDomainColor } : h;
      });
    }

    return newGrid;
  }

  // Заносит в стейт последовательные изменения ряда гексагонов 
  const mergeDomainsGroup = (hexesWithNewDomain, gridHexes) => {
    const newGrid = hexesWithNewDomain.reduce((acc, h) => {
      return mergeDomains(h, acc);
    }, gridHexes);

    changeGridState(newGrid);
  }

  const findHollowDomains = (gridHexes) => {
    // Определяем гексагоны у которых нет домена 
    const hexesWithoutDomain = gridHexes.filter((h) => !h.domainColor);
    const hexesAroundedOneDomain = hexesWithoutDomain.filter((h) => {
      const neighbors = findNeighbors(h, gridHexes);
      const neighborsDomains = findNeighborsDomains(neighbors);
      return neighbors.length === HEX_NEIGHBORS_COUNT && neighborsDomains.length === 1;
    });

    // Определяем гексагоны, которые не нарушают условий полого домена
    let rightHexesIds = hexesWithoutDomain.filter((h) => {
      const neighbors = findNeighbors(h, gridHexes);
      const neighborsDomains = findNeighborsDomains(neighbors);
      return neighbors.length === HEX_NEIGHBORS_COUNT && neighborsDomains.length <= 1;
    }).map((h) => h.id);

    // Проверка соседей
    const collectNeighborsWithoutDomain = (neighborsNeedCheck = [], chekedNeighborsIds, domain) => {
      const hex = neighborsNeedCheck[0];

      const neighbors = findNeighbors(hex, gridHexes);
      // Определяем соседей не включенных в домен
      const neighborsWithoutDomain = neighbors.filter((n) => !n.domainColor);
      // Опеределяем какие из соседей ранее еще не были проверены
      const uncheckedNeighbors = neighborsWithoutDomain.filter((n) => !chekedNeighborsIds.includes(n.id));

      // Определяем домен соседей
      const neightborsDomains = findNeighborsDomains(neighbors);

      // Домен соседей не совпадает с ранее определенным доменом, либо гексоген нарушает условия полого домена
      // То прерываем выполнение функции с отрицательным результатом
      if ((neightborsDomains[0] && neightborsDomains[0] !== domain) || !rightHexesIds.includes(hex.id)) {
        return false;
        // Если более соседей для проверки не обнаружено, то домен является полым
      } else if (neighborsNeedCheck.length === 1 && !uncheckedNeighbors.length) {
        return domain;
        // Продолжаем проверять соседей
      } else {
        rightHexesIds = rightHexesIds.filter((id) => id !== hex.id);
        const newNeighborsNeedCheck = [...neighborsNeedCheck.slice(1, neighborsNeedCheck.length), ...uncheckedNeighbors];
        const newChekedNeighborsIds = [...chekedNeighborsIds, hex.id]
        return collectNeighborsWithoutDomain(newNeighborsNeedCheck, newChekedNeighborsIds, domain);
      }
    }

    // Исходя из гексагонов у которых нет домена, определяем являются ли они заключенными в полый домен
    const hollowDomains = hexesAroundedOneDomain.reduce((acc, h) => {
      const neighbors = findNeighbors(h, gridHexes);
      const hexNeightborsDomain = findNeighborsDomains(neighbors)[0];
      const result = acc.includes(hexNeightborsDomain)
        ? false
        : collectNeighborsWithoutDomain([h], [], hexNeightborsDomain);

      return result ? [...acc, result] : acc;
    }, []);

    return hollowDomains.length;
  }

  // передает общее количество доменов, полых доменов, гексагонов и вероятность для таблицы в стейт
  const calculateDomains = (chance) => {
    const totalHexes = hexes.length;
    const checkedHexes = hexes.filter((h) => h.domainColor).length;

    const newCalc = {
      chance: chance || "Ручной ввод",
      totalDomains: domains.length,
      hollowDomains: findHollowDomains(hexes),
      countOfHexes: `${totalHexes} ячеек / ${checkedHexes} имеющих значение 1`
    };

    const addRowIntoCalcs = (rows, newRow) => {
      const assignKey = (arr) => arr.map((item, index) => ({ ...item, key: index }));

      const oldRows = rows.length < TABLE_ROWS_LIMIT ? rows : rows.slice(1, rows.length);
      return assignKey([...oldRows, newRow]);
    }

    setCalcs(addRowIntoCalcs(calcs, newCalc));
    showTable();
  }

  return (
    <>
      <Layout>
        <Header className="size-form">
          <GridSizeForm updateGridSize={setGridSize} />
          {hexes.length > 0 &&
            <>
              <Chance autoCheckHexes={autoCheckHexes} />
              <DomainsResult
                calculateDomains={calculateDomains}
                domainsCount={domains.length}
              />
            </>}
        </Header>
        <Content hexes={hexes} onHexClick={selectHex} />
      </Layout>

      <Drawer
        title="Результаты"
        placement="right"
        closable={false}
        onClose={showTable}
        visible={visibleTable}
        width="50%"
      >
        <ResultTable calcs={calcs} />
      </Drawer>
    </>
  );
}
