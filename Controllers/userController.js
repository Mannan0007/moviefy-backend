import generateToken from "../config/generateToken.js";
import User from "../Models/userModels.js"
import asyncHandler from 'express-async-handler'

export const registerUser = async (req, res) => {
  try {
    const { email, password, username, dob } = req.body;

    if (!email || !password || !username || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userNameCheck = await User.findOne({ username });
    if (userNameCheck) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.create({
      email,
      password,
      username,
      dob,
    });

    if (user) {
      const token = generateToken(user._id); // ✅ generate token here
      return res.status(201).json({
        message: "User registered successfully",
        _id: user._id,
        email: user.email,
        username: user.username,
        dob: user.dob,
        watchlist: user.watchlist || [],
        token, // ✅ include the token in response
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fill both email and password" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email or password doesn't match" });
    }

    const token = generateToken(user._id); // ✅ Generate token

    // ✅ Send full response with token
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      dob: user.dob,
      watchlist: user.watchlist || [],
      token, // ✅ Send token back to frontend
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occurred" });
  }
};



export const addToWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; // comes from middleware
  const { id, title, poster } = req.body;

  const user = await User.findById(userId);

  if (user) {
    // Avoid duplicates (optional)
    const alreadyExists = user.watchlist.find((item) => item.id === id);
    if (alreadyExists) {
      return res.status(400).json({ message: "Item already in watchlist" });
    }

    user.watchlist.push({ id, title, poster });
    await user.save();

    res
      .status(200)
      .json({ message: "Added to watchlist", watchlist: user.watchlist });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("watchlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
};

export const markAsWatched = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const movie = user.watchlist.find((item) => item.id === id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found in watchlist" });
    }

    movie.watched = !movie.watched; // toggle watched state
    await user.save();

    res
      .status(200)
      .json({
        message: `Marked as ${movie.watched ? "watched" : "unwatched"}`,
      });
  } catch (error) {
    console.error("Error marking as watched:", error);
    res.status(500).json({ message: "Failed to update watch status" });
  }
};
