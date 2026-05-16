import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.role !== undefined) {
      if (user._id.equals(req.user._id) && req.body.role !== 'admin') {
        return res.status(400).json({ message: 'You cannot remove your own admin role' });
      }
      if (!['user', 'admin'].includes(req.body.role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = req.body.role;
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      isBanned: updated.isBanned,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const setUserBanned = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'You cannot ban your own account' });
    }

    user.isBanned = req.body.isBanned === true || req.body.isBanned === 'true';
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBanned: user.isBanned,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the only admin account' });
      }
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
