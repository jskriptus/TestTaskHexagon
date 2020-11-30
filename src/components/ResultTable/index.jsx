import React from "react";
import { Table } from "antd";
import "../../styles.css";

const ResultTable = ({ calcs }) => {
  const { Column, ColumnGroup } = Table;

  const renderTable = (
    <Table
      bordered
      dataSource={calcs}
      pagination={{ defaultPageSize: 10, hideOnSinglePage: true }}
    >
      <Column
        title="Вероятность"
        dataIndex="chance"
        key="chance"
        width={100}
      />
      <ColumnGroup title="Количество доменов в решётке">
        <Column 
          title="Всего" 
          dataIndex="totalDomains" 
          key="totalDomains" 
          width={100}
        />
        <Column
          title="Из них неодносвязных"
          dataIndex="hollowDomains"
          key="hollowDomains"
          width={100}
        />
      </ColumnGroup>
      <Column
        title="Количество ячеек в решётке (L;N;M), из них имеющих значение 1"
        dataIndex="countOfHexes"
        key="countOfHexes"
      />
    </Table>
  );

  return calcs.length ? renderTable : <></>;
};

export default ResultTable;
