import React from "react";
import "../../styles.css";
import { SmileOutlined } from "@ant-design/icons";

import {
    Result,
    Button
} from "antd";

const DomainsResult = ({ domainsCount, calculateDomains }) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Result
                icon={<SmileOutlined />}
                title={`Всего доменов: ${domainsCount}`}
            />
            <Button onClick={() => calculateDomains()} type="primary">
                Посчитать домены
            </Button>
        </div>
    );
};

export default DomainsResult;