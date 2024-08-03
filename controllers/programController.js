import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Program } from "../models/Program.js";
import { Vendor } from "../models/Vendor.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getAllPrograms = catchAsyncError(async (req, res, next) => {
  const programs = await Program.find({});

  res.status(200).json({
    sucess: true,
    programs,
  });
});

export const createProgram = catchAsyncError(async (req, res, next) => {
  const {
    country = "Default Country",
    duration = "Default Duration",
    totalCost = 0,
    advance = 0,
    workPermit = false,
    passportRequest = false,
    visaCost = 0,
    deduction = 0,
    province = "Default Province",
    processDuration = "Default Process Duration",
    jobs = [],
    documents = [],
    requirements = [],
    benefits = [],
    vendor,
    vendorFees,
    currency,
  } = req.body;

  const selectedVendor = await Vendor.findById(vendor);

  if (!selectedVendor) {
    return next(new ErrorHandler("Invalid Vendor Id"));
  }

  for (const job of jobs) {
    const { title, salary } = job;

    if (!title || !salary) {
      return next(new ErrorHandler("Please Enter all fields for jobs", 404));
    }
  }

  for (const doc of documents) {
    const { title } = doc;

    if (!title) {
      return next(
        new ErrorHandler("Please Enter all fields for documents", 404)
      );
    }
  }

  for (const requirement of requirements) {
    const { title } = requirement;

    if (!title) {
      return next(
        new ErrorHandler("Please Enter all fields for requirements", 404)
      );
    }
  }

  for (const benefit of benefits) {
    const { title } = benefit;

    if (!title) {
      return next(
        new ErrorHandler("Please Enter all fields for benefits", 404)
      );
    }
  }

  await Program.create({
    generalInformation: {
      country,
      duration,
      totalCost,
      advance,
      workPermit,
      passportRequest,
      visaCost,
      deduction,
      province,
      processDuration,
    },
    jobs,
    requirements,
    documents,
    benefits,

    vendor: {
      id: vendor,
      fees: vendorFees,
      currency: currency,
    },
  });

  res.status(200).json({
    success: true,
    message: "Program Created Successfully",
  });
});

export const updateProgram = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    country,
    duration,
    totalCost,
    advance,
    workPermit,
    passportRequest,
    visaCost,
    deduction,
    province,
    processDuration,
    jobs,
    documents,
    requirements,
    benefits,
  } = req.body;

  const program = await Program.findById(id);
  if (!program) {
    return next(new ErrorHandler("Program not found", 404));
  }

  if (country) program.generalInformation.country = country;
  if (duration) program.generalInformation[0].duration = duration;
  if (totalCost) program.generalInformation[0].totalCost = totalCost;
  if (advance) program.generalInformation[0].advance = advance;
  if (workPermit) program.generalInformation[0].workPermit = workPermit;
  if (passportRequest)
    program.generalInformation[0].passportRequest = passportRequest;
  if (visaCost) program.generalInformation[0].visaCost = visaCost;
  if (deduction) program.generalInformation[0].deduction = deduction;
  if (province) program.generalInformation[0].province = province;
  if (processDuration)
    program.generalInformation[0].processDuration = processDuration;

  if (jobs) {
    for (const job of jobs) {
      const { title, salary } = job;

      if (!title || !salary) {
        return next(new ErrorHandler("Please Enter all fields for jobs", 404));
      }
    }
    program.jobs = jobs;
  }

  if (documents) {
    for (const doc of documents) {
      const { title } = doc;

      if (!title) {
        return next(
          new ErrorHandler("Please Enter all fields for documents", 404)
        );
      }
    }
    program.documents = documents;
  }

  if (requirements) {
    for (const requirement of requirements) {
      const { title } = requirement;

      if (!title) {
        return next(
          new ErrorHandler("Please Enter all fields for requirements", 404)
        );
      }
    }
    program.requirements = requirements;
  }

  if (benefits) {
    for (const benefit of benefits) {
      const { title } = benefit;

      if (!title) {
        return next(
          new ErrorHandler("Please Enter all fields for benefits", 404)
        );
      }
    }
    program.benefits = benefits;
  }

  await program.save();

  res.status(200).json({
    success: true,
    message: "Program Updated Successfully",
  });
});

export const getProgram = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const program = await Program.findById(id);
  if (!program) return next(new ErrorHandler("Invalid Program Id", 404));

  res.status(200).json({
    sucess: true,
    program,
  });
});

export const updateProgramStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const program = await Program.findById(id);
  if (!program) return next(new ErrorHandler("Invalid Program Id", 404));

  program.status === "active" ? "deactivate" : "active";

  await program.save();

  res.status(200).json({
    sucess: true,
    message: "Program Status Updated Successfully",
  });
});
