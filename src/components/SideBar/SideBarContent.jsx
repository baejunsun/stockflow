import React, { useRef, useState, useCallback } from 'react';
import Search from './Search';
import StockListContainer from '../../containers/SideBar/StockListContainer';
import CurrencyListContainer from '../../containers/SideBar/CurrencyListContainer';
import CurrencyContainer from '../../containers/SideBar/CurrencyContainer';

export default function SideBarContent() {
  const searchValue = useRef();
  const searchDone = useRef();
  const [sort, setSort] = useState('name');
  const [stockSearch, setStockSearch] = useState('')
  const [currencySearch, setCurrencySearch] = useState('')
  const [menu, setMenu] = useState(true)

  const checkSearchDone = useCallback((menu) => {
    clearTimeout(searchDone.current);
    searchDone.current = setTimeout(() => {
      if (menu) { setStockSearch(searchValue.current.value) }
      else {
        setCurrencySearch(searchValue.current.value)
      };
    }, 1500)
  }, [])

  const selectedValue = useCallback((e) => {
    setSort(e.target.value);
  }, [])

  const changeMode = useCallback((e) => {
    setMenu(e);
    searchValue.current.value = '';
    setStockSearch('');
    setCurrencySearch('');
  }, [])
  return (
    <>
      <label htmlFor="sort-choice">Sort</label>
      <select id="sort-chocie" onChange={selectedValue}>
        <option defaultValue="name" >name</option>
        <option value="expensive">expensive</option>
        <option value="cheap">cheap</option>
      </select>
      <input type="text" onChange={() => { checkSearchDone(menu) }} ref={searchValue} />
      <button onClick={() => { changeMode(false) }}>Currency</button>
      <button onClick={() => { changeMode(true) }}>Stock</button>
      <StockListContainer search={stockSearch} sort={sort} menu={menu} />
      <CurrencyListContainer search={currencySearch} sort={sort} menu={menu} />
    </>
  )
}