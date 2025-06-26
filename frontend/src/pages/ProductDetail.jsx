import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import RelatedProduct from '../components/RelatedProduct';
import Loading from '../components/Loading';

function ProductDetail() {
  const { productId } = useParams();
  const { products, currency, loading } = useContext(shopDataContext);
  const [productData, setProductData] = useState(null);

  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image1);
    }
  }, [productId, products]);

  const handleBuyNow = () => {
    if (!size) {
      alert('Please select a size');
      return;
    }

    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: 'rzp_test_GdvzMapjZfjjgn', // ✅ Replace with your Razorpay test key
      amount: productData.price * qty * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'OneCart',
      description: `Purchase - ${productData.name}`,
      handler: function (response) {
        alert('✅ Payment Successful!\nPayment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'OneCart User',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#2f97f1'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!productData) return <Loading />;

  return (
    <div className="w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white">
      <div className="flex flex-col lg:flex-row gap-10 p-10">
        {/* Image Section */}
        <div className="flex flex-col md:flex-row gap-4 lg:w-1/2 items-center">
          <div className="flex flex-row md:flex-col gap-3">
            {[productData.image1, productData.image2, productData.image3, productData.image4].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className="w-16 h-16 md:w-24 md:h-24 rounded-md cursor-pointer border border-gray-500"
                onClick={() => setImage(img)}
              />
            ))}
          </div>
          <div className="w-full max-w-md border border-gray-700 rounded-md">
            <img src={image} alt="main" className="w-full h-auto object-cover rounded-md" />
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{productData.name.toUpperCase()}</h1>
          <div className="flex items-center gap-1 mb-2">
            <FaStar className="text-yellow-400" />
            <FaStar className="text-yellow-400" />
            <FaStar className="text-yellow-400" />
            <FaStar className="text-yellow-400" />
            <FaStarHalfAlt className="text-yellow-400" />
            <span className="ml-2 text-white">(124)</span>
          </div>
          <p className="text-2xl font-semibold text-white mb-4">
            {currency} {productData.price}
          </p>
          <p className="mb-4 text-lg text-gray-300">{productData.description}</p>

          {/* Size Selector */}
          <p className="text-lg mb-1">Select Size</p>
          <div className="flex gap-2 mb-4">
            {productData.sizes.map((s, idx) => (
              <button
                key={idx}
                className={`border px-4 py-2 rounded ${size === s ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <p className="text-lg mb-1">Quantity</p>
          <div className="flex items-center bg-gray-700 w-fit rounded px-3 py-1 mb-5">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-2xl px-2">-</button>
            <span className="px-3 text-xl">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="text-2xl px-2">+</button>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold shadow-md"
          >
            Buy Now
          </button>

          {/* Extra Info */}
          <div className="mt-6 text-sm text-gray-400">
            <p>✔️ 100% Original Product</p>
            <p>✔️ Cash on Delivery available</p>
            <p>✔️ Easy return/exchange within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Related */}
      <div className="px-10 mt-10">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-300 mb-8">
          Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneCart.
          Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style.
          Easy to maintain and perfect for any setting.
        </p>
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>
    </div>
  );
}

export default ProductDetail;
