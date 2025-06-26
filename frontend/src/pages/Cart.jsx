import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import CartTotal from '../components/CartTotal';

function Cart() {
  const { products, currency, cartItem, updateQuantity } = useContext(shopDataContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItem) {
      for (const size in cartItem[itemId]) {
        if (cartItem[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size,
            quantity: cartItem[itemId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] overflow-hidden bg-gradient-to-l from-[#141414] to-[#0c2025]'>
      <div className='h-[8%] w-[100%] text-center mt-[80px]'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div className='w-[100%] min-h-[60vh] flex flex-wrap gap-[20px]'>
        {cartData.length === 0 ? (
          <p className='text-white text-[22px] ml-5 mt-10'>🛒 Your cart is empty.</p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find(p => p._id === item._id);

            if (!productData) return null; // If product not found, skip rendering

            return (
              <div key={index} className='w-[100%] border-t border-b py-4'>
                <div className='w-[100%] flex items-start gap-6 bg-[#51808048] py-[10px] px-[20px] rounded-2xl relative'>
                  <img
                    className='w-[100px] h-[100px] rounded-md'
                    src={productData.image1 || "/images/default.png"}
                    alt="Product"
                  />
                  <div className='flex flex-col gap-2'>
                    <p className='md:text-[25px] text-[20px] text-[#f3f9fc]'>{productData.name}</p>
                    <div className='flex gap-5 items-center'>
                      <p className='text-[20px] text-[#aaf4e7]'>{currency} {productData.price}</p>
                      <p className='w-[40px] h-[40px] text-white text-[16px] bg-[#518080b4] rounded-md flex items-center justify-center border border-[#9ff9f9]'>
                        {item.size}
                      </p>
                    </div>
                  </div>

                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className='md:max-w-20 max-w-10 px-2 py-2 text-white text-[18px] font-semibold bg-[#518080b4] absolute md:top-[40%] top-[46%] left-[75%] md:left-[50%] border border-[#9ff9f9] rounded-md'
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0) updateQuantity(item._id, item.size, val);
                    }}
                  />

                  <RiDeleteBin6Line
                    className='text-[#9ff9f9] w-[25px] h-[25px] absolute top-[50%] md:top-[40%] md:right-[5%] right-1 cursor-pointer'
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartData.length > 0 && (
        <div className='flex justify-start items-end my-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal />
            <button
              className='text-[18px] hover:bg-slate-500 cursor-pointer bg-[#51808048] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] border border-[#80808049] ml-[30px] mt-[20px]'
              onClick={() => navigate("/placeorder")}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
