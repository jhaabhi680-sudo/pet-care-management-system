import MedicalRecord from '../models/MedicalRecord.js';
import Pet from '../models/Pet.js';

/**
 * @desc    Get medical records (filtered by owned pets for owners, all for vets/admin)
 * @route   GET /api/medical-records
 * @access  Private
 */
export const getMedicalRecords = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'owner') {
      // Find all pets belonging to this user
      const userPets = await Pet.find({ owner: req.user._id }).select('_id');
      const petIds = userPets.map((p) => p._id);
      query.pet = { $in: petIds };
    }

    const records = await MedicalRecord.find(query)
      .populate('pet', 'name species breed age owner')
      .populate('veterinarian', 'name email')
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single medical record by ID
 * @route   GET /api/medical-records/:id
 * @access  Private
 */
export const getMedicalRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('pet', 'name species breed age owner')
      .populate('veterinarian', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // If owner, ensure pet belongs to them
    if (req.user.role === 'owner') {
      const pet = await Pet.findById(record.pet._id);
      if (!pet || pet.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this medical record' });
      }
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new medical record (Doctor / Admin only)
 * @route   POST /api/medical-records
 * @access  Private (Admin / Vet only)
 */
export const createMedicalRecord = async (req, res, next) => {
  try {
    const { pet, visitDate, diagnosis, symptoms, treatment, prescription, vaccination, notes } =
      req.body;

    if (!pet || !diagnosis || !treatment) {
      return res.status(400).json({
        message: 'Please provide pet, diagnosis, and treatment details',
      });
    }

    const petRecord = await Pet.findById(pet);
    if (!petRecord) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Create the medical record
    const record = await MedicalRecord.create({
      pet,
      veterinarian: req.user._id,
      visitDate: visitDate || Date.now(),
      diagnosis,
      symptoms,
      treatment,
      prescription,
      vaccination,
      notes,
    });

    // If a vaccination was administered, optionally update pet's status
    if (vaccination) {
      await Pet.findByIdAndUpdate(pet, { vaccinationStatus: 'Up to date' });
    }

    const populated = await MedicalRecord.findById(record._id)
      .populate('pet', 'name species breed')
      .populate('veterinarian', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update medical record (Doctor / Admin only)
 * @route   PUT /api/medical-records/:id
 * @access  Private (Admin / Vet only)
 */
export const updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('pet', 'name species breed')
      .populate('veterinarian', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete medical record (Doctor / Admin only)
 * @route   DELETE /api/medical-records/:id
 * @access  Private (Admin / Vet only)
 */
export const deleteMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    await record.deleteOne();
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
