import React, { useEffect, useState } from 'react';
import * as V from 'victory';
import { useDispatch } from 'react-redux';
import { getSelectedStockSagaActionCreator } from '../../redux/modules/selectedStock';
import { getSelectedSymbolActionCreator } from '../../redux/modules/selectedSymbol';
import { LoadingOutlined } from '@ant-design/icons'

export default function StockList({
  stockList,
  getsidebarStock,
  loading,
  search,
  menu,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    getsidebarStock(search);
  }, [getsidebarStock, search]);

  const sendSymbol = (selectedStock) => {
    dispatch(getSelectedStockSagaActionCreator(selectedStock, 'stock'));
    dispatch(getSelectedSymbolActionCreator(selectedStock, 'stock'));
  };


  if (!loading) {
    return (
      <div className="sidebar stock">
        <ul className={menu === 'stock' ? '' : 'none'}>
          {stockList.map(
            (stock) => {
              let stocks = [];
              const keys = stock.stockData.map((date) => date.time).reverse();
              const values = stock.stockData.map((item) => +item.open);
              keys.forEach((item, i) => {
                stocks.push({ date: item, price: values[i] });
              });
              let color = stock.change[0] === '-' ? 'yellow' : 'red';

              function transSymbol(e) {
                e.stopPropagation();
                sendSymbol(stock.symbol);
              }

              // const selectedBookmark = (e) => {
              //   if (e.target.parentNode.previousElementSibling.firstElementChild.nodeValue === stock.symbol) {
              //     console.log(e.target.value)
              //     setMark(!mark)
              //   }
              // }

              return (

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
                    <div className='bookmark'>
                      <img src="./images/bookmark_false.png" alt="bookmark_false" className='bookmark_false' />
                      <img src="./images/bookmark_true.png" alt="bookmark_true" className='bookmark_true' />
                    </div>
                  </div>

                </li>
              );
            },

            // <li><Plot
            //   data={[
            //     {
            //       x: Object.keys(stock.stockData),
            //       y: Object.values(stock.stockData).map(item => item["1. open"]),
            //       type: 'scatter',
            //       mode: 'lines',
            //     },
            //   ]}
            //   layout={{ width: 400, height: 250, showlegend: false, modebar: false, displaymodebar: false }}

            // />
            //   {stock.change}
            //   {stock.symbol}
            // </li>)
          )}
        </ul>
      </div>
    );
  } else {
    return <LoadingOutlined />
  }
}