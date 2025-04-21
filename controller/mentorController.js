const Project = require('../models/project');
const Mentor = require('../models/mentor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ✅ Register a new mentor
exports.registerMentor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: 'Mentor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMentor = new Mentor({
      name,
      email,
      password: hashedPassword,
    });

    await newMentor.save();

    res.status(201).json({ message: 'Mentor registered successfully' });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// ✅ Login mentor
exports.loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: mentor._id, role: 'mentor' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ✅ Get mentor's projects
exports.getMentorProjects = async (req, res) => {
  try {
    const projects = await Project.find({ mentor: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mentor projects" });
  }
};

// ✅ Give feedback on a project
exports.giveFeedback = async (req, res) => {
  try {
    // Logic for giving feedback (you can update this as per your schema)
    res.status(200).json({ message: "Feedback given successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to give feedback" });
  }
};

// ✅ Add comment to a project
exports.addComment = async (req, res) => {
  const { projectId, comment } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.comments.push({ text: comment, date: new Date() });
    await project.save();

    res.json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};
