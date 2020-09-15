import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as V from 'victory';
import { getSelectedSymbolActionCreator } from '../../redux/modules/selectedSymbol';
import { getSelectedStockSagaActionCreator } from '../../redux/modules/selectedStock';

export default function FavoriteList({
  favoriteStockList,
  favoriteCurrencyList,
  currencyList,
  stockList,
  menu,
  loading,
  currencyLoading,
}) {
  const [value, setValue] = useState('stock')

  const dispatch = useDispatch();
  const selected = useRef()
  // return <div>A</div>;

  const sendCurrencySymbol = (selectedStock) => {
    dispatch(getSelectedStockSagaActionCreator(selectedStock, 'currency'));
    dispatch(getSelectedSymbolActionCreator(selectedStock, 'currency'));
  };

  const sendStockSymbol = (selectedStock) => {
    dispatch(getSelectedStockSagaActionCreator(selectedStock, 'stock'));
    dispatch(getSelectedSymbolActionCreator(selectedStock, 'stock'));
  };

  // currencyList = favoriteCurrencyList.filter((favoriteCurrencyList) => {
  //   return (
  //     favoriteCurrencyList.symbol ===
  //     currencyList['Meta Data']['2. Digital Currency Code']
  //   );
  // });

  // stockList = favoriteStockList.filter((favoriteStockList) => {
  //   return favoriteStockList.symbol === stockList.symbol;
  // });

  const selectedValue = () => {
    setValue(selected.current.value)
  };


  if (favoriteCurrencyList.length !== 0 && !currencyLoading) {
    return (
      <>
        <select className="sortbox sortValuebox" id="sort-chocie" onChange={selectedValue} ref={selected}>
          <option defaultValue="stock">stock</option>
          <option value="currency">currency</option>
        </select>
        <div className="sidebar favorite">
          <ul className={menu === 'favorite' ? '' : 'none'}>
            {favoriteCurrencyList.map((favoriteCurrencyList) => {
              const currency = currencyList.filter((currency) => {
                return (
                  favoriteCurrencyList.symbol ===
                  currency['Meta Data']['2. Digital Currency Code']
                );
              })[0];
              let currencys = [];
              const keys = Object.keys(
                currency['Time Series (Digital Currency Daily)'],
              ).reverse();
              const values = Object.values(
                currency['Time Series (Digital Currency Daily)'],
              )
                .map((item) => item['1a. open (USD)'])
                .reverse();
              keys.forEach((item, i) => {
                currencys.push({ date: item, price: values[i] });
              });
              // let color = currency.change[0] === "-" ? "green" : "red"

              function transSymbol(e) {
                e.stopPropagation();
                sendCurrencySymbol(
                  currency['Meta Data']['2. Digital Currency Code'],
                );
              }

              return (
                <>
                  {value === 'currency' &&
                    <li onClick={transSymbol} className="clear-fix">
                      {/* {currency.change} */}
                      <div className="sidebar-left">
                        <span className="sidebar-symbol">
                          {currency['Meta Data']['2. Digital Currency Code']}
                        </span>
                        <br />
                        <span className="sidebar-name">
                          {currency['Meta Data']['3. Digital Currency Name']}
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
                      </div>
                    </li>}
                </>
              );
            })}
            {(favoriteStockList.length !== 0 && !loading) && favoriteStockList.map((symbol) => {
              const stock = stockList.filter((stock) => {
                return symbol.symbol === stock.symbol;
              })[0];
              console.log(stock);
              let stocks = [];
              const keys = stock.stockData.map((date) => date.time);
              const values = stock.stockData.map((item) => +item.open);
              keys.forEach((item, i) => {
                stocks.push({ date: item, price: values[i] });
              });
              let color = stock.change[0] === '-' ? 'yellow' : 'red';

              function transSymbol(e) {
                e.stopPropagation();
                sendStockSymbol(stock.symbol);
              }

              return (
                <>
                  {value === 'stock' &&
                    <li onClick={transSymbol} className="clear-fix">

                      <div className="sidebar-left">
                        <span className="sidebar-symbol">{stock.symbol}</span>
                        <br />
                        <span className="sidebar-name">{stock.name}</span>
                        <br />
                      </div>
                      <div className="sidebar-right">
                        <V.VictoryLine
                          data={stocks}
                          x="date"
                          y="price"
                          style={{
                            data: { stroke: color },
                            parent: {
                              width: 50,
                              height: 'auto',
                            },
                          }}
                        />

                        <span className="sidebar-change">{stock.change}</span>
                      </div>
                    </li>}
                </>
              );
            })}
          </ul>
        </div>
      </>
    );
  } else {
    return <div></div>
  }


}