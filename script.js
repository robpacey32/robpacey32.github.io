// Example data for blog posts (replace with your own data)
const blogPosts = [
    {
        title: "My First Blog Post",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        author: "John Doe",
        date: "April 1, 2024"
    },
    {
        title: "Another Blog Post",
        content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        author: "Jane Smith",
        date: "April 5, 2024"
    }
];

// Function to display blog posts
function displayBlogPosts() {
    const blogPostsSection = document.getElementById("blog-posts");
    blogPosts.forEach(post => {
        const postElement = document.createElement("article");
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p><strong>Author:</strong> ${post.author}</p>
            <p><strong>Date:</strong> ${post.date}</p>
            <hr>
        `;
        blogPostsSection.appendChild(postElement);
    });
}

// Call the function to display blog posts
displayBlogPosts();
