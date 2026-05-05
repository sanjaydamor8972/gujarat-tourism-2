import { verifyToken, isAdmin } from "../middleware/auth.js";

// ADD PLACE (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const newPlace = new Place(req.body);
  await newPlace.save();
  res.json(newPlace);
});

// DELETE PLACE (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});