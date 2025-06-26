import React, { useContext, useEffect, useState } from 'react';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Title from "../components/Title";
import { shopDataContext } from '../context/ShopContext';
import Card from '../components/Card';

function Collections() {
  const [showFilter, setShowFilter] = useState(false);
  const { products, search, showSearch } = useContext(shopDataContext);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (showSearch && search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) =>
        category.includes(item.category?.toLowerCase())
      );
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) =>
        subCategory.includes(item.subCategory?.toLowerCase())
      );
    }

    switch (sortType) {
      case 'low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilterProduct(filtered);
  };

  useEffect(() => {
    setFilterProduct(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, sortType]);

  return (
    <div className='w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row pt-[70px] overflow-x-hidden pb-[110px]'>

      {/* Sidebar Filters */}
      <div className={`md:w-[30vw] lg:w-[20vw] w-[100vw] ${showFilter ? "h-[45vh]" : "h-[8vh]"} p-[20px] border-r border-gray-400 text-[#aaf5fa] lg:fixed`}>
        <p className='text-[25px] font-semibold flex gap-[5px] items-center cursor-pointer' onClick={() => setShowFilter(!showFilter)}>
          FILTERS
          {!showFilter ? <FaChevronRight className='md:hidden' /> : <FaChevronDown className='md:hidden' />}
        </p>

        <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${showFilter ? "" : "hidden"} md:block`}>
          <p className='text-[18px] text-[#f8fafa]'>CATEGORIES</p>
          <div className='flex flex-col gap-[10px]'>
            <label><input type="checkbox" value="men" onChange={toggleCategory} /> Men</label>
            <label><input type="checkbox" value="women" onChange={toggleCategory} /> Women</label>
            <label><input type="checkbox" value="kids" onChange={toggleCategory} /> Kids</label>
          </div>
        </div>

        <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${showFilter ? "" : "hidden"} md:block`}>
          <p className='text-[18px] text-[#f8fafa]'>SUB-CATEGORIES</p>
          <div className='flex flex-col gap-[10px]'>
            <label><input type="checkbox" value="topwear" onChange={toggleSubCategory} /> TopWear</label>
            <label><input type="checkbox" value="bottomwear" onChange={toggleSubCategory} /> BottomWear</label>
            <label><input type="checkbox" value="winterwear" onChange={toggleSubCategory} /> WinterWear</label>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className='lg:pl-[20%] px-[20px] w-full'>
        <div className='flex flex-col lg:flex-row justify-between items-center w-full mb-6'>
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            className='bg-slate-600 w-[60%] md:w-[200px] h-[50px] px-[10px] text-white rounded-lg border-[2px]'
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>

        <div className='flex flex-wrap gap-[30px] justify-center items-start'>
          {filterProduct.length > 0 ? (
            filterProduct.map((item, index) => (
              <Card
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image1 || "https://via.placeholder.com/250"}
              />
            ))
          ) : (
            <p className='text-white text-lg'>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collections;
