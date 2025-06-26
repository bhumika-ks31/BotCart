import jwt from "jsonwebtoken";

// ✅ Named export for user token
export function genToken(userId) {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log("Token generation error:", error);
    return null;
  }
}

// ✅ Named export for admin token
export function genToken1(adminEmail) {
  try {
    const token = jwt.sign({ adminEmail }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log("Admin token error:", error);
    return null;
  }
}
