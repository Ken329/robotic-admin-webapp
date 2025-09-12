import React from 'react';

import { Button, ButtonGroup, HStack, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ToggleButton = ({
  value,
  options = [],
  onChange,
  colorScheme = 'blue',
  layout = 'row',
  size = 'md'
}) => {
  const Wrapper = layout === 'row' ? HStack : VStack;

  return (
    <ButtonGroup isAttached>
      <Wrapper spacing={2}>
        {options.map(option => (
          <Button
            key={option}
            variant={value === option ? 'solid' : 'outline'}
            colorScheme={value === option ? colorScheme : 'gray'}
            size={size}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </Wrapper>
    </ButtonGroup>
  );
};

ToggleButton.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  colorScheme: PropTypes.string,
  layout: PropTypes.oneOf(['row', 'column']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
};

export default ToggleButton;
