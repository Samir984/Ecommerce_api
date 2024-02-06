import Customer from "../models/customer.model.js";
import AppError from "../utils/AppError.js";

import AppResponse from "../utils/AppReponse.js";
console.log(Customer);
export const signUpCustomer = async (req, res) => {
  const { fullName, email, password, avatar } = req.body;

  console.log('Customer enter')
  if (!fullName || !email || !password)
    return new AppError(400, "All fileds are required");

  const customerExit = await Customer.findOne({ email });
  if (customerExit)
    throw new AppError(409, "Accoutn already exits, Please login");
  console.log(req.file);
  return res.status(200).send("hello");

  //   return res.status(200).json(new AppResponse(customer));
};


