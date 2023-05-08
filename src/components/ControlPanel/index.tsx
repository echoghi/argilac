import { Button, Space } from 'antd';

const ControlPanel = ({ isRunning = true }) => {
  return (
    <Space direction="horizontal">
      <Space wrap>
        {isRunning ? (
          <Button type="primary" danger size="large">
            Stop
          </Button>
        ) : (
          <Button type="primary" size="large">
            Start
          </Button>
        )}
      </Space>
    </Space>
  );
};

export default ControlPanel;
