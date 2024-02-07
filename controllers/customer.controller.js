import Customer from "../models/customer.model.js";
import AppError from "../utils/AppError.js";
import AppResponse from "../utils/AppReponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
console.log(Customer);
export const signUpCustomer = AsyncHandler(async (req, res, next) => {
  const { fullName, email, password, avatar } = req.body;
  console.log(fullName, email, password);
  if (!fullName || !email || !password)
    throw new AppError(400, "All fileds are required");

  const customerExit = await Customer.findOne({ email });
  if (customerExit)
    throw new AppError(409, "Accoutn already exits, Please login");


  console.log(req.file);
  return res.status(200).send("hello");

  //   return res.status(200).json(new AppResponse(customer));
});
