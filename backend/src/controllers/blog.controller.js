import Blog from "../models/blog.model.js";

// @desc    Create a blog (NGO only)
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, description, skills, region } = req.body;

    if (!title || !description || !skills) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const blog = await Blog.create({
      title,
      description,
      skills: Array.isArray(skills) ? skills : skills.split(",").map(sk => sk.trim()),
      region,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blogs of the logged-in NGO
// @route   GET /api/blogs/my
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.user.id }).sort("-createdAt");
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Check ownership
    if (blog.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this blog" });
    }

    const { title, description, skills, region } = req.body;
    
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        skills: Array.isArray(skills) ? skills : skills.split(",").map(sk => sk.trim()),
        region
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Check ownership
    if (blog.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: "Blog removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
