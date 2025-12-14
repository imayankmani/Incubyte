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
    const searchQuery = {};

    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' };
    }
    
    if (category) {
      searchQuery.category = category;
    }
    
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) {
        searchQuery.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        searchQuery.price.$lte = Number(maxPrice);
      }
    }

    const sweets = await Sweet.find(searchQuery);
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
    const requestedQuantity = req.body.quantity || 1;
    
    if (requestedQuantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    if (sweet.quantity < requestedQuantity) {
      return res.status(400).json({ 
        error: 'Insufficient quantity in stock',
        available: sweet.quantity
      });
    }
    
    sweet.quantity -= requestedQuantity;
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
    const restockQuantity = req.body.quantity;
    
    if (!restockQuantity || restockQuantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    sweet.quantity += restockQuantity;
    await sweet.save();
    
    res.json({ 
      message: 'Restock successful',
      sweet 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};