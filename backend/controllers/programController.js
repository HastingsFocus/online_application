const Program = require("../models/Program");

// GET all programs
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find().select('-__v');
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching programs",
      error: error.message
    });
  }
};

// GET program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).select('-__v');
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching program",
      error: error.message
    });
  }
};

// Check eligibility for all programs based on subjects
const checkEligibility = async (req, res) => {
  try {
    const { subjects } = req.body;
    
    // Get all programs
    const programs = await Program.find();
    
    // Check eligibility for each program
    const eligibilityResults = programs.map(program => {
      const reasons = [];
      let eligible = true;
      
      // Check if all subjects meet the minimum points
      if (program.allSubjectsMinPoints) {
        subjects.forEach(subject => {
          if (subject.gradePoints > program.allSubjectsMinPoints) {
            eligible = false;
            reasons.push(`${subject.name} has ${subject.gradePoints} points, but needs ${program.allSubjectsMinPoints} or less`);
          }
        });
      }
      
      // Check specific required subjects
      program.requiredSubjects.forEach(required => {
        const subject = subjects.find(s => s.name === required.name);
        if (!subject) {
          eligible = false;
          reasons.push(`Missing required subject: ${required.name}`);
        } else if (subject.gradePoints > required.minPoints) {
          eligible = false;
          reasons.push(`${required.name} has ${subject.gradePoints} points, but needs ${required.minPoints} or less`);
        }
      });
      
      return {
        programId: program._id,
        programName: program.name,
        programCode: program.code,
        description: program.description,
        eligible,
        reasons: eligible ? ["You meet all requirements"] : reasons
      };
    });
    
    res.status(200).json(eligibilityResults);
  } catch (error) {
    res.status(500).json({
      message: "Error checking eligibility",
      error: error.message
    });
  }
};

module.exports = {
  getPrograms,
  getProgramById,
  checkEligibility
};