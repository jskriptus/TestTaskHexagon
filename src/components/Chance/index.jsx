import React, { useState } from "react";
import "../../styles.css";
import { DEFAULT_CHANCE, MIN_CHANCE, MAX_CHANCE, CHANCE_STEP } from "../../constants";
import {
  Form,
  InputNumber,
  Button
} from "antd";

const Chance = ({ autoCheckHexes }) => {
  const [chance, setChance] = useState(DEFAULT_CHANCE);

  const submitHandler = () => autoCheckHexes(chance);
  const inputPercentHandler = (value) => setChance(value);

  return (
    <Form
      layout="vertical"
    >
      <Form.Item
        extra={<span className="size-form-extra">{`${MIN_CHANCE} - ${MAX_CHANCE}`}</span>}
        label={<label className="size-form-label">Вероятность</label>}
      >
        <InputNumber
          size="large"
          min={MIN_CHANCE}
          max={MAX_CHANCE}
          step={CHANCE_STEP}
          value={chance}
          onChange={inputPercentHandler}
        />
      </Form.Item>
      <Button onClick={submitHandler} className="chance-button" type="primary">
        АВТО
      </Button>
    </Form>
  );
};

export default Chance;