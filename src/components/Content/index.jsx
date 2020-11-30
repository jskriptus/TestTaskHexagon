import React from "react";
import { Layout } from "antd";
import "../../styles.css";

const Content = ({ hexes, onHexClick }) => {
  const { Content } = Layout;

  const clickHandler = (e) => onHexClick(e.target.id);

  return (
    <Layout>
      <Content>
        <div className="grid" onClick={clickHandler}>
          {hexes.map((hex) => {
            const style = {
              width: 15,
              height: 8,
              left: `${hex.x}px`,
              top: `${hex.y}px`
            };

            const styleBackgroundColor = {
              '--chekedBackground': hex.domainColor,
              backgroundColor: hex.domainColor,
            };

            const styleWithBackgroundColor = { ...style, ...styleBackgroundColor };

            return (
              <div
                className={hex.domainColor ? "checked-hex" : "hex"}
                key={hex.id}
                id={hex.id}
                style={hex.domainColor ? styleWithBackgroundColor : style}
              >
                {hex.domainColor && "1"}
              </div>
            );
          })}
        </div>
      </Content>
    </Layout>
  );
};

export default Content;
