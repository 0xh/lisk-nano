import React from 'react';
import BigNumber from 'bignumber.js';

/**
 *
 * @param {*} num - it is a number that we want to normalize it
 * @return {string} - normalized version of input number
 */
const normalize = value => new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed();
/**
 *
 * @param {*} num - it is a number that we want to format it as formatted number
 * @return {string} - formatted version of input number
 */
const formatNumber = (num) => {
  num = parseFloat(normalize(num));
  const sign = num < 0 ? '-' : '';
  const absVal = String(parseInt(num = Math.abs(Number(num) || 0), 10));
  let remaining = absVal.length;
  remaining = (remaining) > 3 ? remaining % 3 : 0;
  const intPart = sign + (remaining ? `${absVal.substr(0, remaining)},` : '') +
     absVal.substr(remaining).replace(/(\d{3})(?=\d)/g, '$1,');
  const floatPart = num.toString().split('.')[1];
  num = floatPart ? `${intPart}.${floatPart || ''}` : intPart;
  return num;
};
const FormattedNumber = (props) => {
  const formatedNumber = formatNumber(props.val);
  return <span>{formatedNumber}</span>;
};

export default FormattedNumber;
