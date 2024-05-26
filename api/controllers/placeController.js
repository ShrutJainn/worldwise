import Place from "../models/placeModel.js";
import User from "../models/userModel.js";

export async function createPlace(req, res) {
  try {
    const { cityName, country, notes, emoji, position } = req.body;
    const owner = req.user._id.toString();
    const user = await User.findById(owner);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorized to create place" });
    }

    const newPlace = new Place({
      cityName,
      country,
      notes,
      emoji,
      owner,
      position,
    });
    newPlace.save();

    res.status(200).json({ message: "Place saved successfully", newPlace });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePlace(req, res) {
  try {
    const { placeId } = req.params;
    const place = await Place.findById(placeId);
    if (!place) return res.status(400).json({ error: "Place not found" });

    if (place.owner.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Unauthorized to delete this place" });
    }

    await Place.findByIdAndDelete(placeId);
    res.status(200).json({ message: "Place deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
}

export async function getPlaces(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const places = await Place.find({ owner: { $in: user._id } });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
}
