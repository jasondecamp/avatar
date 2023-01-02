import { merge } from 'lodash';

export const address = (address,options) => {
  options = merge({},{
    street: true,
    unit: true,
    city: true,
    state: true,
    zipcode: true
  },options);
  address = address || {};
  return [
    (options.street ? address.street : null),
    (options.unit ? address.unit : null),
    (options.city ? address.city : null),[
      (options.state ? address.state : null),
      (options.zipcode ? address.zipcode : null)
    ].filter((v)=>v).join(' ')
  ].filter((v)=>v).join(', ');
};
