import jwt from "jsonwebtoken";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

// export default generateToken;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      dob:user.dob,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};
export default generateToken;
