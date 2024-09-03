document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const searchForm = document.getElementById("blogSearchForm");
  const newBlogForm = document.getElementById("newBlogForm");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (searchForm) {
    searchForm.addEventListener("submit", searchBlogs);
  }

  if (newBlogForm) {
    newBlogForm.addEventListener("submit", createBlogPost);
  }

  fetchAndDisplayBlogs();
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.reload();
}

async function searchBlogs(event) {
  event.preventDefault();
  const searchQuery = document.getElementById("searchQuery").value;
  try {
    const response = await fetch(
      `/api/blogs/search?query=${encodeURIComponent(searchQuery)}`
    );
    const blogs = await response.json();
    displayBlogs(blogs);
  } catch (error) {
    console.error("Error searching blogs:", error);
    alert("An error occurred while searching blogs.");
  }
}

async function createBlogPost(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById("category").value;
  const tags = document
    .getElementById("tags")
    .value.split(",")
    .map((tag) => tag.trim());
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category, tags }),
    });

    if (response.ok) {
      alert("Blog post created successfully!");
      event.target.reset();
      await fetchAndDisplayBlogs();
    } else {
      const data = await response.json();
      alert(`Failed to create blog post: ${data.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while creating the blog post.");
  }
}

async function fetchAndDisplayBlogs() {
  try {
    const response = await fetch("/api/blogs");
    const blogs = await response.json();
    displayBlogs(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    document.getElementById("blogPosts").innerHTML =
      "<p>Error fetching blog posts.</p>";
  }
}

function displayBlogs(blogs) {
  const blogPosts = document.getElementById("blogPosts");
  if (blogs.length > 0) {
    blogPosts.innerHTML = blogs
      .map(
        (blog) => `
          <div class="blog-post">
              <h3><a href="/blog/${blog._id}">${blog.title}</a></h3>
              <p>${blog.content.substring(0, 200)}...</p>
              <small>
                  Posted by ${blog.author.username} on ${new Date(
          blog.createdAt
        ).toDateString()}
                  ${blog.category ? `| Category: ${blog.category.name}` : ""}
                  ${
                    blog.tags.length > 0
                      ? `| Tags: ${blog.tags.join(", ")}`
                      : ""
                  }
              </small>
          </div>
      `
      )
      .join("");
  } else {
    blogPosts.innerHTML = "<p>No blog posts available.</p>";
  }
}
