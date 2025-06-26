import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import razorpay from '../assets/Razorpay.jpg';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

function PlaceOrder() {
  let [method, setMethod] = useState('cod');
  let navigate = useNavigate();
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [loading, setLoading] = useState(false);

  let [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true });
        if (data) {
          navigate("/order");
          setCartItem({});
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let orderItems = [];
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        case 'cod': {
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true });
          console.log(result.data);
          if (result.data) {
            setCartItem({});
            toast.success("Order Placed");
            navigate("/order");
          } else {
            console.log(result.data.message);
            toast.error("Order Placement Error");
          }
          setLoading(false);
          break;
        }

        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });
          if (resultRazorpay.data) {
            initPay(resultRazorpay.data);
            toast.success("Order Placed");
          }
          setLoading(false);
          break;
        }

        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px] relative'>
      {/* Form */}
      <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center mt-[90px] lg:mt-0'>
        <form onSubmit={onSubmitHandler} className='lg:w-[70%] w-[95%]'>
          <div className='py-[10px]'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>
          {/* Input Fields */}
          <div className='w-full h-[70px] flex gap-[10px] px-[10px]'>
            <input type="text" name='firstName' value={formData.firstName} onChange={onChangeHandler} placeholder='First name' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
            <input type="text" name='lastName' value={formData.lastName} onChange={onChangeHandler} placeholder='Last name' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
          </div>

          <div className='w-full h-[70px] px-[10px]'>
            <input type="email" name='email' value={formData.email} onChange={onChangeHandler} placeholder='Email address' className='w-full h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
          </div>

          <div className='w-full h-[70px] px-[10px]'>
            <input type="text" name='street' value={formData.street} onChange={onChangeHandler} placeholder='Street' className='w-full h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
          </div>

          <div className='w-full h-[70px] flex gap-[10px] px-[10px]'>
            <input type="text" name='city' value={formData.city} onChange={onChangeHandler} placeholder='City' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
            <input type="text" name='state' value={formData.state} onChange={onChangeHandler} placeholder='State' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
          </div>

          <div className='w-full h-[70px] flex gap-[10px] px-[10px]'>
            <input type="text" name='pinCode' value={formData.pinCode} onChange={onChangeHandler} placeholder='Pincode' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
            <input type="text" name='country' value={formData.country} onChange={onChangeHandler} placeholder='Country' className='w-[48%] h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
          </div>

          <div className='w-full h-[70px] px-[10px]'>
            <input type="text" name='phone' value={formData.phone} onChange={onChangeHandler} placeholder='Phone' className='w-full h-[50px] rounded-md bg-slate-700 placeholder:text-white text-[18px] px-[20px]' required />
          </div>

          <div>
            <button type='submit' className='text-[18px] active:bg-slate-500 bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border border-[#80808049] ml-[30px] mt-[20px]'>
              {loading ? <Loading /> : "PLACE ORDER"}
            </button>
          </div>
        </form>
      </div>

      {/* Cart Total & Payment */}
      <div className='lg:w-[50%] w-full min-h-full flex items-center justify-center gap-[30px]'>
        <div className='lg:w-[70%] w-[90%] flex flex-col items-center gap-[10px]'>
          <CartTotal />
          <div className='py-[10px]'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
          </div>
          <div className='w-full h-[100px] flex justify-center gap-[50px] mt-[20px]'>
            <button onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-[5px] border-blue-900' : ''}`}>
              <img src={razorpay} alt="razorpay" className='w-full h-full object-fill rounded-sm' />
            </button>
            <button onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-[5px] border-blue-900' : ''}`}>
              CASH ON DELIVERY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
