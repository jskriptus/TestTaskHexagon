import React, { useState } from "react";
import { InputNumber, Space, Form, Button } from "antd";
import { DEFAULT_GRID_SIZE, MIN_GRID_SIZE, MAX_GRID_SIZE, GRID_SIZE_STEP } from "../../constans";
import { objectToArray } from "../../utils/";
import "../../styles.css";

const GridSizeForm = ({ updateGridSize }) => {
    const [form] = Form.useForm();
    const { L, M, N } = DEFAULT_GRID_SIZE;
    const [newGridSize, setNewGridSize] = useState({ L, M, N });

    const submitHandler = () => updateGridSize(newGridSize);

    const inputHandler = (param, value) => {
        setNewGridSize((size) => ({
            ...size,
            [param]: Math.floor(value)
        }));
    };

    const renderGridSizeInput = () => {
        const gridSizeArray = objectToArray(newGridSize);

        return gridSizeArray.map((item, index) =>
            (
                <Form.Item
                    key={`inputKey_${index}`}
                    extra={<span className="size-form-extra">{`${MIN_GRID_SIZE} - ${MAX_GRID_SIZE}`}</span>}
                    label={<label className="size-form-label">{item.key}</label>}
                >
                    <InputNumber
                        size="large"
                        min={MIN_GRID_SIZE}
                        max={MAX_GRID_SIZE}
                        step={GRID_SIZE_STEP}
                        value={item.value}
                        onChange={(value) => inputHandler(item.key, value)}
                    />
                </Form.Item>
            )
        );
    };

    return (
        <Form layout="vertical" form={form}>
            <Space size={5}>
                {renderGridSizeInput()}
            </Space>
            <Button onClick={submitHandler} className="show-button" type="primary" htmlType="submit">
                Отобразить
            </Button>
        </Form>
    );
};

export default GridSizeForm;