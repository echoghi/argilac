import React from 'react';
import { Select } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { SelectProps } from 'antd';

interface ProjectSelectProps {
  defaultValue?: string;
  size?: SizeType;
  onChange: (value: string | string[]) => void;
  options: SelectProps['options'];
}

const ProjectSelect = ({ onChange, options, defaultValue }: ProjectSelectProps) => {
  return (
    <>
      <Select
        size="large"
        defaultValue={defaultValue}
        onChange={onChange}
        style={{ width: 250 }}
        options={options}
      />
    </>
  );
};

export default ProjectSelect;
