// components/Header.tsx
import React from 'react';
import { Row, Col, Typography, Badge, Avatar } from 'antd';

import styles from './Header.module.css';

const { Title, Text } = Typography;

interface HeaderProps {
  status: boolean | undefined;
}

const Header: React.FC<HeaderProps> = ({ status }: HeaderProps) => {
  return (
    <Row className={styles.headerContainer}>
      <Row>
        <Col>
          <div>
            <div className={styles.badgeContainer}>
              <Badge
                status={status ? 'processing' : 'default'}
                title={status ? 'Running' : 'Halted'}
              />
            </div>
            <Avatar src="/logo.png" alt="Argilac Logo" shape="square" size={75} />
          </div>
        </Col>
        <div className={styles.titleContainer}>
          <Title level={3}>Argilac</Title>
          <Text>Automated Trading Bot</Text>
        </div>
      </Row>
    </Row>
  );
};

export default Header;
