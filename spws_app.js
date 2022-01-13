// ==UserScript==
// @name         show price with shipping
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @updateURL    https://raw.githubusercontent.com/anemochore/showPriceWithShipping/master/spws_app.js
// @downloadURL  https://raw.githubusercontent.com/anemochore/showPriceWithShipping/master/spws_app.js
// @description  try to take over the world!
// @author       fallensky@naver.com
// @include      https://www.aliexpress.com/item/*
// ==/UserScript==


// ver 0.1 @ 2022-1-13
//    first version.


(() => {
  //todo: complete this list.
  const units = {
    KRW: {
      unit: '₩ ',
      digits: 0,
    },
    USD: {
      unit: 'US $',
      digits: 2,
    },
  };

  let CURRENCY = document.querySelector('span.currency')?.innerText;
  if(!units[CURRENCY]) {
    console.error('not supported currency!');
    return;
  }

  CURRENCY = units[CURRENCY];
  let shipping = document.querySelector('div.product-shipping-price')?.innerText;
  shipping = parseFloat(shipping.slice(shipping.indexOf(CURRENCY.unit)+CURRENCY.unit.length).replace(/\,/g, '').trim());

  if(isNaN(shipping)) {
    console.log('no shipping fee. nothing to do.');
    return;
  }

  const priceEl = document.querySelector('span.product-price-value') 
  || document.querySelector('span.uniform-banner-box-price');
  const price = parseFloat(priceEl?.innerText.replace(CURRENCY.unit, '').replace(/\,/g, '').trim());

  const newPrice = CURRENCY.unit 
  + parseFloat((price + shipping).toFixed(CURRENCY.digits)).toLocaleString() 
  + ' (shipping incl.)';

  const newPriceEl = document.createElement('div');
  newPriceEl.className = 'product-price-current';

  const newPriceSpanEl = document.createElement('span');
  newPriceSpanEl.className = 'product-price-value';

  newPriceSpanEl.innerText = newPrice;
  newPriceEl.appendChild(newPriceSpanEl);

  priceEl.className = 'product-price-del';
  const priceParentEl = priceEl.parentNode;
  priceParentEl.className = 'product-price-original';

  priceParentEl.parentNode.insertBefore(newPriceEl, priceParentEl);
})();