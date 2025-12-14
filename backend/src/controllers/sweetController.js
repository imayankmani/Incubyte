const Sweet = require('../models/Sweet');

exports.createSweet = async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.purchaseSweet = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in stock' });
    }
    
    sweet.quantity -= quantity;
    await sweet.save();
    
    res.json({ 
      message: 'Purchase successful',
      sweet 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    sweet.quantity += quantity;
    await sweet.save();
    
    res.json({ 
      message: 'Restock successful',
      sweet 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};