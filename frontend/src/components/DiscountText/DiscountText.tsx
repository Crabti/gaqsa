import React from 'react';
import { Row } from 'antd';
import Text from 'antd/lib/typography/Text';
import { DiscountTextProps } from './DiscountText.type';

const DiscountText: React.FC<DiscountTextProps> = (
  { discount, originalPrice },
) => (discount ? (
  <Row>
    <Text delete style={{ marginRight: '0.5rem' }}>
      $
      {originalPrice}
    </Text>
    <Text style={{ color: 'red' }}>
      $
      {(originalPrice
          - originalPrice * discount).toFixed(2)}
    </Text>
  </Row>
) : (
  <Text>
    $
    {originalPrice}
  </Text>
));

export default DiscountText;
