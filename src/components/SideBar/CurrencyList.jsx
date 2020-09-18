import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as V from 'victory';
import { getSelectedSymbolActionCreator } from '../../redux/modules/selectedSymbol';
import { getSelectedStockSagaActionCreator } from '../../redux/modules/selectedStock';
import { getfavoriteListButtonActionCreator } from '../../redux/modules/selectedSymbol'

export default function CurrencyList({
  currencyList,
  renderCurrencyList,
  menu,
}) {
  useEffect(() => {
    renderCurrencyList();
  }, [renderCurrencyList]);

  const dispatch = useDispatch();

  const sendSymbol = (selectedStock, favoriteDataList) => {
    dispatch(getSelectedStockSagaActionCreator(selectedStock, 'currency'));
    dispatch(getSelectedSymbolActionCreator(selectedStock, 'currency'));
    // dispatch(getfavoriteListButtonActionCreator(selectedStock, favoriteDataList, 'currency'))
  };

  const sendToSymbol = (selectedStock) => {
    dispatch(getfavoriteListButtonActionCreator(selectedStock, 'currency'))
  }

  const favoriteData = useSelector(state => state.selectedSymbol.selectedCurrencySymbol)


  console.log(favoriteData)

  return (
    <div className="sidebar currency">
      <ul className={menu === 'currency' ? '' : 'none'}>
        {currencyList.map((currency) => {
          let currencys = [];
          const keys = Object.keys(
            currency.currencyData,
          ).reverse();
          const values = Object.values(
            currency.currencyData,
          )
            .map((item) => item.open)
            .reverse();
          keys.forEach((item, i) => {
            currencys.push({ date: item, price: values[i] });
          });
          // let color = currency.change[0] === "-" ? "green" : "red"

          function transSymbol(e) {
            e.stopPropagation();
            sendSymbol(currency.symbol);
          }

          const symbol = currency.symbol
          let favoriteDataList = false;
          if (favoriteData.filter((currency) => currency.symbol === symbol).length !== 0) {
            favoriteDataList = favoriteData.filter((currency) => currency.symbol === symbol)[0].favorite
            console.log(favoriteDataList)
          }

          function selectedFavorite(e) {
            e.stopPropagation();
            sendToSymbol(currency.symbol);
            if (favoriteData.filter((currency) => currency.symbol === symbol).length !== 0) {
              favoriteDataList = !favoriteDataList
            }
          }

          return (
            <li onClick={transSymbol} className="clear-fix">
              {/* {currency.change} */}
              <div className="sidebar-left">
                <span className="sidebar-symbol">
                  {currency.symbol}
                </span>
                <br />
                <span className="sidebar-name">
                  {currency.name}
                </span>
              </div>
              <div className="sidebar-right">
                <V.VictoryLine
                  data={currencys}
                  x="date"
                  y="price"
                  style={{
                    data: { stroke: 'yellow' },
                    parent: {
                      width: 50,
                      height: 'auto',
                    },
                  }}
                />
                <button className='bookmark' onClick={selectedFavorite}>
                  {favoriteDataList ? <img src="./images/bookmark_true.png" alt="bookmark_true" className='bookmark_true' /> : <img src="./images/bookmark_false.png" alt="bookmark_false" className='bookmark_false' />}
                </button>
              </div>

            </li>
          );
        })}
      </ul>
    </div>
  );
}

// <ul className={menu ? "none" : ""}>
//   {
//     currencyList.length && (currencyList.map((currency, i) => (

//       i < 10 && (<li><Plot
//         data={[
//           {
//             x: Object.keys(currency["Time Series (Digital Currency Daily)"]),
//             y: Object.values(currency["Time Series (Digital Currency Daily)"]).map(item => item["1a. open (USD)"]),
//             type: 'scatter',
//             mode: 'lines',
//           },
//         ]}
//         layout={{ width: 400, height: 250, title: currency["Meta Data"]["3. Digital Currency Name"] }}
//       />
//       </li>))
//     ))
//   }
// </ul>