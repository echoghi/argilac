// components/Header.tsx
import React from 'react';
import { Row, Col, Typography } from 'antd';
import styles from './Header.module.css';
import Image from 'next/image';

const { Title, Text } = Typography;

interface HeaderProps {
  onButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Row className={styles.headerContainer}>
      <Row>
        <Col>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="Argilac Logo" width="75" height="75" />
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
