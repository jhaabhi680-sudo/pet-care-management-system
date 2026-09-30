import Service from '../models/Service.js';

/**
 * @desc    Get all clinic services
 * @route   GET /api/services
 * @access  Public / Private
 */
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get service by ID
 * @route   GET /api/services/:id
 * @access  Public / Private
 */
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new clinic service
 * @route   POST /api/services
 * @access  Private (Admin / Vet only)
 */
export const createService = async (req, res, next) => {
  try {
    const { name, description, price, duration } = req.body;

    if (!name || price === undefined || !duration) {
      return res.status(400).json({ message: 'Please provide name, price, and duration' });
    }

    const existing = await Service.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'A service with this name already exists' });
    }

    const service = await Service.create({
      name,
      description,
      price,
      duration,
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a service
 * @route   PUT /api/services/:id
 * @access  Private (Admin / Vet only)
 */
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a service
 * @route   DELETE /api/services/:id
 * @access  Private (Admin / Vet only)
 */
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
