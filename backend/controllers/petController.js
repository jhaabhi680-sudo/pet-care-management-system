import Pet from '../models/Pet.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';

/**
 * @desc    Get all pets (filtered by owner for pet parents, all pets for admin/vets)
 * @route   GET /api/pets
 * @access  Private
 */
export const getPets = async (req, res, next) => {
  try {
    let query = {};

    // If user is regular pet owner, only retrieve their own pets
    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    }

    const pets = await Pet.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single pet by ID
 * @route   GET /api/pets/:id
 * @access  Private
 */
export const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'name email phone');

    if (!pet) {
      return res.status(404).json({ message: 'Pet profile not found' });
    }

    // Check ownership if user is a normal pet owner
    if (
      req.user.role === 'owner' &&
      pet.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this pet record' });
    }

    res.json(pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new pet
 * @route   POST /api/pets
 * @access  Private
 */
export const createPet = async (req, res, next) => {
  try {
    const {
      name,
      species,
      breed,
      gender,
      age,
      dateOfBirth,
      weight,
      color,
      vaccinationStatus,
      medicalNotes,
      owner,
    } = req.body;

    if (!name || !species || !breed || age === undefined) {
      return res.status(400).json({ message: 'Please provide name, species, breed, and age.' });
    }

    // Set owner: if admin supplied owner use that, otherwise default to current logged-in user
    const assignedOwner =
      (req.user.role === 'admin' || req.user.role === 'veterinarian') && owner
        ? owner
        : req.user._id;

    const pet = await Pet.create({
      name,
      species,
      breed,
      gender: gender || 'Male',
      age,
      dateOfBirth,
      weight,
      color,
      vaccinationStatus: vaccinationStatus || 'Up to date',
      medicalNotes,
      owner: assignedOwner,
    });

    const populatedPet = await Pet.findById(pet._id).populate('owner', 'name email phone');
    res.status(201).json(populatedPet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a pet's details
 * @route   PUT /api/pets/:id
 * @access  Private
 */
export const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Verify ownership
    if (
      req.user.role === 'owner' &&
      pet.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to edit this pet' });
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json(updatedPet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a pet profile
 * @route   DELETE /api/pets/:id
 * @access  Private
 */
export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Verify ownership
    if (
      req.user.role === 'owner' &&
      pet.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this pet' });
    }

    // Cascade clean related records
    await Appointment.deleteMany({ pet: pet._id });
    await MedicalRecord.deleteMany({ pet: pet._id });
    await pet.deleteOne();

    res.json({ message: 'Pet and associated appointments/records removed successfully' });
  } catch (error) {
    next(error);
  }
};
