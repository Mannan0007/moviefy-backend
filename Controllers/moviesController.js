import generateToken from "../config/generateToken.js";
import User from "../Models/userModels.js";
import asyncHandler from "express-async-handler";

export const deleteFromWatchlist = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.watchlist.length;

    user.watchlist = user.watchlist.filter((item) => item.id !== id);

    if (user.watchlist.length === initialLength) {
      return res.status(404).json({ message: "Movie not found in watchlist" });
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Removed from watchlist", watchlist: user.watchlist });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Failed to remove movie" });
  }
};
