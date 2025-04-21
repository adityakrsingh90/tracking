const Project = require('../models/project');

// Apply for a project
exports.applyProject = async (req, res) => {
  const { title, techStack, mentor } = req.body;
  const project = new Project({ title, techStack, mentor, student: req.user.id });
  await project.save();
  res.status(201).json({ message: 'Project applied successfully' });
};

// Get student's projects
exports.getMyProjects = async (req, res) => {
  const projects = await Project.find({ student: req.user.id }).populate('mentor');
  res.json(projects);
};

// Submit project file
exports.submitProjectFile = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  // Assuming the file submission happens here (handle file upload logic as needed)
  project.submissionStatus = 'Submitted';
  await project.save();
  res.json({ message: 'Project file submitted successfully' });
};

// Get submission status of a project
exports.getSubmissionStatus = async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ status: project.submissionStatus });
};
