import React from 'react'
import axiosInstance from '../utils/axiosInstance';

const Premium = () => {

  const handleBuyClick = async(type) => {
    const order = await axiosInstance.post( "/payment/create", {
      membershipType: type,
    },)

    // It should open the razorpay dialog box
    const {amount, keyId, currency, notes, orderId} = order.data
    const options = {
      key: keyId, // Razorpay Key ID (TEST or LIVE)
      amount, 
      currency,
      name: "Notes App", 
      description: "Connect to other developers",
      order_id: orderId,
      image: "https://play.google.com/store/apps/details?id=com.task.notes",

      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        // contact: "9999999999",
      },

      // notes: {
      //   address: "India",
      // },

      theme: {
        color: "#3399cc",
      },
    };

    //This line will oen up the razorpay dialog box , this is very important
    const rzp = new window.Razorpay(options)
    rzp.open()
  }
  
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Upgrade to Premium
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Unlock powerful features to manage your notes better
        </p>
      </div>

      {/* Plans */}
      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
        
        {/* Silver Plan */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full md:w-[300px] hover:-translate-y-1 transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Silver Plan
          </h2>

          <p className="text-3xl font-bold text-gray-900 mb-1">
            ₹99
            <span className="text-sm font-medium text-gray-500">/month</span>
          </p>

          <p className="text-gray-600 text-sm mb-6">
            Perfect for casual note-taking
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li>✔ Create up to 50 notes</li>
            <li>✔ Basic text editor</li>
            <li>✔ Manual delete & edit</li>
            <li>✔ Secure login</li>
          </ul>

          <button
            className="w-full mt-10 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-slate-600 to-gray-800
             hover:from-slate-700 hover:to-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={() => handleBuyClick("silver")}>
            Choose Silver
          </button>
        </div>

        {/* Gold Plan */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full md:w-[300px] border-2 border-yellow-500 relative hover:-translate-y-1 transition">
          <span className="absolute -top-3 right-4 text-white text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 shadow-md">
            Recommended
          </span>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Gold Plan
          </h2>

          <p className="text-3xl font-bold text-gray-900 mb-1">
            ₹199
            <span className="text-sm font-medium text-gray-500">/month</span>
          </p>

          <p className="text-gray-600 text-sm mb-6">
            For power users & professionals
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li>✔ Unlimited notes</li>
            <li>✔ Rich text editor</li>
            <li>✔ Pin & favorite notes</li>
            <li>✔ Cloud sync & backup</li>
            <li>✔ Priority support</li>
          </ul>

          <button
            className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700  transition text-white font-semibold "
            onClick={() => handleBuyClick("gold")}
          >
            Choose Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium