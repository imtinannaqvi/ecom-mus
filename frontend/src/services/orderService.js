import API from '../api/api'

export const placeOrder = async (payload) => {
  try {
    const res = await API.post("/order/new", payload);

    if (res.data.success) {
      return {
        success: true,
        order: res.data.order
      };
    } else {
      return {
        success: false,
        message: res.data.message || "Order placement failed"
      };
    }
  }
  catch (err) {
    console.log("Order Error:", err.message);
    return {
      success: false,
      message: err.response?.data?.message || "Server Error"
    };
  }
}

export const getOrder = async () => {
  try {
    const res = await API.get('/order/get-order')
    return res.data.orders


  } catch (error) {
    console.log(error.message)
  }
}

export const cancelOrder = async (id) => {
  try {
    const res = await API.post(`/order/cancel/${id}`);

    if (res.data && res.data.success) {
      return res.data;
    }

    return null;
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    console.log("Service Error:", errorMsg);
    throw new Error(errorMsg);
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await API.get(`/order/get-order-by-id/${id}`);
    
    // Axios ka data hamesha res.data mein hota hai
    // Agar backend 'success: true' bhej raha hai toh check kar lo
    if (res.data && res.data.success) {
      return res.data.order || res.data.data; // Jo bhi key aapne backend se bheji hai
    }
    
    return null;
  } catch (err) {
    // Error ko console mein detail se dekho taaki debugging asaan ho
    const message = err.response?.data?.message || err.message;
    console.error("GetOrderById Error:", message);
    
    // Yahan return null ya throw error kar sakte ho
    return null; 
  }
};