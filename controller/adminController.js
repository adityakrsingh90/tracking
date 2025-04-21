const User = require('../models/user');
const Project = require('../models/project');

exports.getAllStudents = async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
};

exports.getAllProjects = async (req, res) => {
  const projects = await Project.find().populate('student').populate('mentor');
  res.json(projects);
};

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mentors', error: err.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  const { projectId, status } = req.body;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  project.status = status;
  await project.save();
  res.json({ message: 'Project status updated' });
};

// ✅ ADD THESE MISSING EXPORTS

exports.approveProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  project.status = 'approved';
  await project.save();
  res.json({ message: 'Project approved successfully' });
};

exports.rejectProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  project.status = 'rejected';
  await project.save();
  res.json({ message: 'Project rejected successfully' });
};

exports.assignMentorToProject = async (req, res) => {
  const { projectId, mentorId } = req.body;
  const project = await Project.findById(projectId);
  const mentor = await User.findById(mentorId);

  if (!project || !mentor) return res.status(404).json({ message: 'Project or Mentor not found' });

  project.mentor = mentorId;
  await project.save();
  res.json({ message: 'Mentor assigned to project' });
};
