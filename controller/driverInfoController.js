const Driver = require('../model/driverInfoModel');

exports.driverInfoHandler = (req,res,next) => {
   // Prefer session user id; if not present (e.g., client-only flow), accept driverId from the multipart form body.
   const sessionUserId = req.session && req.session.user && req.session.user._id;
   const clientDriverId = req.body && req.body.driverId;
   const driverIdToUse = sessionUserId || clientDriverId || null;

   if (!driverIdToUse) {
      return res.status(401).json({ error: 'Authentication required to create driver profile (no driverId in session or request)' });
   }

   console.log('driverInfoHandler: using driverId =', driverIdToUse, ' (from', sessionUserId ? 'session' : 'client', ')');

   const newDriver = new Driver({
      driverId: driverIdToUse,
      name: req.body.fullName || req.body.name,
      email: req.body.email,  
      address: req.body.address,
      license: req.body.license,
      idProof: req.body.idProof,
      idProofImage: req.files && req.files['idProofImage'] ? req.files['idProofImage'][0].filename : '',
      experience: req.body.experience,
      previousWork: req.body.previousWork,
      preferredRoutes: req.body.preferredRoutes,
      emergencyContact: req.body.emergencyContact,
      photo: req.files && req.files['photo'] ? req.files['photo'][0].filename : ''
   });

   newDriver.save()
   .then(driver => res.status(201).json(driver))
   .catch(err => res.status(400).json({ error: err.message }));
}






exports.getAllDrivers = async (req,res,next) => {
   const driversData = await Driver.find();
   res.status(200).json(driversData);
}