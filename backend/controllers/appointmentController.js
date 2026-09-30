import Appointment from '../models/Appointment.js';
import Pet from '../models/Pet.js';

/**
 * @desc    Get all appointments (role-based)
 * @route   GET /api/appointments
 * @access  Private
 */
export const getAppointments = async (req, res, next) => {
  try {
    let query = {};

    // Pet owners only see their own appointments
    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('pet', 'name species breed age')
      .populate('owner', 'name email phone')
      .populate('veterinarian', 'name email phone')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('pet', 'name species breed age')
      .populate('owner', 'name email phone')
      .populate('veterinarian', 'name email phone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (
      req.user.role === 'owner' &&
      appointment.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
export const createAppointment = async (req, res, next) => {
  try {
    const { pet, veterinarian, service, appointmentDate, appointmentTime, reason, notes } =
      req.body;

    if (!pet || !service || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        message: 'Please provide pet, service, appointmentDate, appointmentTime, and reason.',
      });
    }

    // Verify pet exists
    const petRecord = await Pet.findById(pet);
    if (!petRecord) {
      return res.status(404).json({ message: 'Selected pet not found' });
    }

    // Verify ownership
    if (
      req.user.role === 'owner' &&
      petRecord.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Cannot book appointment for another user’s pet' });
    }

    const appointment = await Appointment.create({
      pet,
      owner: req.user.role === 'owner' ? req.user._id : petRecord.owner,
      veterinarian: veterinarian || undefined,
      service,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
      status: 'Pending',
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('pet', 'name species breed')
      .populate('owner', 'name email phone')
      .populate('veterinarian', 'name email phone');

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment status or details
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Owners can only cancel their own appointments
    if (req.user.role === 'owner') {
      if (appointment.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to modify this appointment' });
      }
      if (req.body.status && req.body.status !== 'Cancelled') {
        return res.status(403).json({
          message: 'Owners can only cancel bookings. Status approval requires veterinarian action.',
        });
      }
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('pet', 'name species breed')
      .populate('owner', 'name email phone')
      .populate('veterinarian', 'name email phone');

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (
      req.user.role === 'owner' &&
      appointment.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
