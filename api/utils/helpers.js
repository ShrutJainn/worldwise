import jwt from "jsonwebtoken";

export function generateTokenAndSetCookie(userId, res) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, //This cookie cannot be accessed by browser, this makes it more secure
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    sameSite: "strict",
  });
  return token;
}
