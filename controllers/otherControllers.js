import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Client } from "../models/Client.js";
import { Contract } from "../models/Contracts.js";
import { Lead } from "../models/Lead.js";
import { Program } from "../models/Program.js";
import { SubAgent } from "../models/SubAgent.js";
import { User } from "../models/User.js";
import { Vendor } from "../models/Vendor.js";

export const getDashboardStats = catchAsyncError(async (req, res, next) => {
  // TotalLeads, Clients, Contracts, Programs, Total Employees, Reports, Vendors, SubAgents

  const leadsCounts = await Lead.countDocuments();
  const clientsCounts = await Client.countDocuments();
  const contractsCounts = await Contract.countDocuments();
  const programCounts = await Program.countDocuments();
  const totalEmployees = await User.countDocuments();
  const vendorsCount = await Vendor.countDocuments();
  const subAgentCounts = await SubAgent.countDocuments();

  let stats = [
    {
      number: leadsCounts,
      title: "Leads",
    },

    {
      number: clientsCounts,
      title: "Clients",
    },

    {
      number: contractsCounts,
      title: "Contracts",
    },

    {
      number: programCounts,
      title: "Program",
    },

    {
      number: totalEmployees,
      title: "Employees",
    },

    {
      number: vendorsCount,
      title: "Vendors",
    },

    {
      number: subAgentCounts,
      title: "Sub Agents",
    },
  ];
  res.status(200).json({
    success: true,
    stats,
  });
});
