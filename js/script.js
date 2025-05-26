// Document Ready Function
document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const mobileMenuBtn = document.querySelector(".mobile-menu");
    const menuOverlay = document.querySelector(".menu-overlay");
    const blogTitle = document.getElementById("blog-title");
    const categorySelect = document.getElementById("blog-category");
    const subcategorySelect = document.getElementById("blog-subcategory");
    const coverImageInput = document.getElementById("cover-image");
    const imageUploadArea = document.querySelector(".image-upload-area");
    const imagePreview = document.querySelector(".image-preview");
    const imageEditor = document.querySelector(".image-editor");
    const imageEditBtns = document.querySelectorAll(".image-edit-btn");
    const tagInput = document.getElementById("tag-input");
    const tagsWrapper = document.querySelector(".tags-wrapper");
    const tagSuggestions = document.querySelectorAll(".tag-suggestion");
    const toolbarBtns = document.querySelectorAll(".toolbar-btn");
    const viewBtns = document.querySelectorAll(".view-btn");
    const editorContent = document.getElementById("editor-content");
    const previewContent = document.getElementById("preview-content");
    const wordCount = document.querySelector(".word-count");
    const titleStrengthMeter = document.querySelector(".meter-fill");
    const titleFeedback = document.querySelector(".title-feedback");
    const characterCount = document.querySelector(".character-count");
    const excerptTextarea = document.getElementById("blog-excerpt");
    const excerptCharCount = document.getElementById("excerpt-char-count");
    const blogForm = document.getElementById("blog-form");
    const saveDraftBtn = document.getElementById("save-draft");
    const previewBlogBtn = document.getElementById("preview-blog");
  
    // Mobile Menu Toggle
    if (mobileMenuBtn && menuOverlay) {
      mobileMenuBtn.addEventListener("click", function () {
        menuOverlay.classList.toggle("active");
      });
    }
  
    // Blog Title Character Count and Strength Meter
    if (blogTitle) {
      blogTitle.addEventListener("input", function () {
        const length = this.value.length;
        let strength = 0;
        let feedbackText = "";
  
        // Update character count
        characterCount.textContent = ${length}/100;
  
        // Calculate title strength
        if (length > 0) {
          if (length < 20) {
            strength = 20;
            feedbackText = "Title is too short";
          } else if (length < 40) {
            strength = 40;
            feedbackText = "Title could be more compelling";
          } else if (length < 60) {
            strength = 60;
            feedbackText = "Good title length";
          } else if (length < 80) {
            strength = 80;
            feedbackText = "Great title!";
          } else {
            strength = 100;
            feedbackText = "Perfect title length!";
          }
        } else {
          feedbackText = "Make your title compelling";
        }
  
        // Update strength meter
        titleStrengthMeter.style.width = ${strength}%;
  
        // Update color based on strength
        if (strength < 40) {
          titleStrengthMeter.style.backgroundColor = "var(--danger)";
        } else if (strength < 70) {
          titleStrengthMeter.style.backgroundColor = "var(--gold)";
        } else {
          titleStrengthMeter.style.backgroundColor = "var(--success)";
        }
  
        // Update feedback text
        titleFeedback.textContent = feedbackText;
      });
    }
  
    // Category and Subcategory Relationship
    if (categorySelect && subcategorySelect) {
      // Subcategory options by category
      const subcategories = {
        technology: [
          "Web Development",
          "Mobile Apps",
          "AI & Machine Learning",
          "Cybersecurity",
          "Hardware",
          "Software",
        ],
        lifestyle: [
          "Wellness",
          "Fashion",
          "Home Decor",
          "Relationships",
          "Self-Improvement",
        ],
        travel: [
          "Adventure",
          "Budget Travel",
          "Luxury Travel",
          "Solo Travel",
          "Family Destinations",
        ],
        food: [
          "Recipes",
          "Restaurant Reviews",
          "Cooking Tips",
          "Diets",
          "Beverages",
        ],
        health: [
          "Fitness",
          "Mental Health",
          "Nutrition",
          "Medical Research",
          "Holistic Health",
        ],
        finance: [
          "Investing",
          "Budgeting",
          "Cryptocurrency",
          "Real Estate",
          "Personal Finance",
        ],
        art: ["Visual Arts", "Music", "Literature", "Performing Arts", "Design"],
        education: [
          "E-Learning",
          "Academic Research",
          "Study Tips",
          "Career Development",
          "Teaching",
        ],
        science: [
          "Physics",
          "Biology",
          "Chemistry",
          "Astronomy",
          "Environmental Science",
        ],
        entertainment: ["Movies", "TV Shows", "Gaming", "Books", "Celebrities"],
      };
  
      categorySelect.addEventListener("change", function () {
        const category = this.value;
  
        // Clear existing options
        subcategorySelect.innerHTML = "";
  
        // If custom category is selected
        if (category === "custom") {
          const customCategory = prompt("Enter a new category:");
          if (customCategory && customCategory.trim() !== "") {
            // Create new option
            const option = document.createElement("option");
            option.value = customCategory.toLowerCase().replace(/\s+/g, "-");
            option.textContent = customCategory;
  
            // Insert before the "custom" option
            const customOption = Array.from(categorySelect.options).find(
              (opt) => opt.value === "custom"
            );
            categorySelect.insertBefore(option, customOption);
            categorySelect.value = option.value;
  
            // Add subcategory prompt
            const subcategoryOption = document.createElement("option");
            subcategoryOption.value = "";
            subcategoryOption.textContent =
              "Add subcategories for your custom category";
            subcategoryOption.selected = true;
            subcategoryOption.disabled = true;
            subcategorySelect.appendChild(subcategoryOption);
          } else {
            this.value = "";
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "First select a category";
            defaultOption.selected = true;
            defaultOption.disabled = true;
            subcategorySelect.appendChild(defaultOption);
          }
          return;
        }
  
        // Add default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a subcategory";
        defaultOption.selected = true;
        defaultOption.disabled = true;
        subcategorySelect.appendChild(defaultOption);
  
        // Add subcategories for selected category
        if (subcategories[category]) {
          subcategories[category].forEach((subcategory) => {
            const option = document.createElement("option");
            option.value = subcategory.toLowerCase().replace(/\s+/g, "-");
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
          });
        }
      });
    }
  
    // Image Upload Handling
    if (imageUploadArea && coverImageInput) {
      // Click on upload area to trigger file input
      imageUploadArea.addEventListener("click", function () {
        coverImageInput.click();
      });
  
      // Handle file selection
      coverImageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            // Show preview
            imagePreview.innerHTML = <img src="${e.target.result}" alt="Cover Image Preview">;
            imagePreview.style.display = "flex";
            imageEditor.style.display = "flex";
          };
          reader.readAsDataURL(file);
        }
      });
  
      // Drag and Drop functionality
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        imageUploadArea.addEventListener(eventName, preventDefaults, false);
      });
  
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
  
      ["dragenter", "dragover"].forEach((eventName) => {
        imageUploadArea.addEventListener(eventName, highlight, false);
      });
  
      ["dragleave", "drop"].forEach((eventName) => {
        imageUploadArea.addEventListener(eventName, unhighlight, false);
      });
  
      function highlight() {
        imageUploadArea.classList.add("highlight");
      }
  
      function unhighlight() {
        imageUploadArea.classList.remove("highlight");
      }
  
      imageUploadArea.addEventListener("drop", handleDrop, false);
  
      function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
  
        if (file && file.type.match("image.*")) {
          coverImageInput.files = dt.files;
  
          const reader = new FileReader();
          reader.onload = function (e) {
            // Show preview
            imagePreview.innerHTML = <img src="${e.target.result}" alt="Cover Image Preview">;
            imagePreview.style.display = "flex";
            imageEditor.style.display = "flex";
          };
          reader.readAsDataURL(file);
        }
      }
    }
  
    // Tags Input Management
    if (tagInput && tagsWrapper) {
      const tags = new Set();
      const MAX_TAGS = 5;
  
      // Add tag when pressing Enter or comma
      tagInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          addTag(this.value.trim());
          this.value = "";
        }
      });
  
      // Add tag when input loses focus
      tagInput.addEventListener("blur", function () {
        if (this.value.trim()) {
          addTag(this.value.trim());
          this.value = "";
        }
      });
  
      // Function to add a tag
      function addTag(text) {
        // Validate tag
        if (!text || tags.size >= MAX_TAGS) return;
  
        // Remove # if present at start
        if (text.startsWith("#")) {
          text = text.substring(1);
        }
  
        // Check if tag already exists
        if (tags.has(text.toLowerCase())) return;
  
        // Add to set
        tags.add(text.toLowerCase());
  
        // Create tag element
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.innerHTML = `
                  ${text}
                  <span class="tag-close" data-tag="${text}">&times;</span>
              `;
  
        // Add to DOM
        tagsWrapper.appendChild(tag);
  
        // Add close handler
        const closeBtn = tag.querySelector(".tag-close");
        closeBtn.addEventListener("click", function () {
          const tagToRemove = this.dataset.tag;
          tags.delete(tagToRemove.toLowerCase());
          tag.remove();
        });
      }
  
      // Tag suggestions
      if (tagSuggestions) {
        tagSuggestions.forEach((suggestion) => {
          suggestion.addEventListener("click", function () {
            // Get text without the # symbol
            const text = this.textContent.trim().substring(1);
            addTag(text);
          });
        });
      }
    }
  
    // Rich Text Editor
    if (toolbarBtns && editorContent) {
      toolbarBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const format = this.dataset.format;
  
          if (format === "heading-1") {
            document.execCommand("formatBlock", false, "<h1>");
          } else if (format === "heading-2") {
            document.execCommand("formatBlock", false, "<h2>");
          } else if (format === "heading-3") {
            document.execCommand("formatBlock", false, "<h3>");
          } else if (format === "paragraph") {
            document.execCommand("formatBlock", false, "<p>");
          } else if (format === "bold") {
            document.execCommand("bold", false, null);
          } else if (format === "italic") {
            document.execCommand("italic", false, null);
          } else if (format === "underline") {
            document.execCommand("underline", false, null);
          } else if (format === "strikethrough") {
            document.execCommand("strikeThrough", false, null);
          } else if (format === "align-left") {
            document.execCommand("justifyLeft", false, null);
          } else if (format === "align-center") {
            document.execCommand("justifyCenter", false, null);
          } else if (format === "align-right") {
            document.execCommand("justifyRight", false, null);
          } else if (format === "align-justify") {
            document.execCommand("justifyFull", false, null);
          } else if (format === "list-unordered") {
            document.execCommand("insertUnorderedList", false, null);
          } else if (format === "list-ordered") {
            document.execCommand("insertOrderedList", false, null);
          } else if (format === "quote") {
            document.execCommand("formatBlock", false, "<blockquote>");
          } else if (format === "code") {
            document.execCommand("formatBlock", false, "<pre>");
          } else if (format === "link") {
            const url = prompt("Enter URL:");
            if (url) {
              document.execCommand("createLink", false, url);
            }
          } else if (format === "image") {
            const url = prompt("Enter image URL:");
            if (url) {
              document.execCommand("insertImage", false, url);
            }
          } else if (format === "video") {
            const url = prompt("Enter video embed URL:");
            if (url) {
              const videoEmbed = <div class="video-embed"><iframe src="${url}" frameborder="0" allowfullscreen></iframe></div>;
              document.execCommand("insertHTML", false, videoEmbed);
            }
          } else if (format === "table") {
            const rows = prompt("Enter number of rows:", "3");
            const cols = prompt("Enter number of columns:", "3");
  
            if (rows && cols) {
              let tableHTML =
                '<table border="1" cellpadding="5" cellspacing="0">';
  
              for (let i = 0; i < parseInt(rows); i++) {
                tableHTML += "<tr>";
  
                for (let j = 0; j < parseInt(cols); j++) {
                  tableHTML += "<td>Cell</td>";
                }
  
                tableHTML += "</tr>";
              }
  
              tableHTML += "</table>";
              document.execCommand("insertHTML", false, tableHTML);
            }
          }
  
          // Update word count after each formatting action
          updateWordCount();
  
          // Update preview if active
          updatePreview();
        });
      });
  
      // Toggle between write, preview, and split view
      if (viewBtns) {
        viewBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            const view = this.dataset.view;
  
            // Remove active class from all buttons
            viewBtns.forEach((b) => b.classList.remove("active"));
  
            // Add active class to clicked button
            this.classList.add("active");
  
            // Hide all views
            document
              .querySelector(".editor-writing-view")
              .classList.remove("active");
            document
              .querySelector(".editor-preview-view")
              .classList.remove("active");
  
            if (view === "write") {
              document
                .querySelector(".editor-writing-view")
                .classList.add("active");
            } else if (view === "preview") {
              document
                .querySelector(".editor-preview-view")
                .classList.add("active");
              updatePreview();
            } else if (view === "split") {
              document
                .querySelector(".editor-writing-view")
                .classList.add("active");
              document
                .querySelector(".editor-preview-view")
                .classList.add("active");
              updatePreview();
            }
          });
        });
      }
  
      // Update word count on content change
      editorContent.addEventListener("input", updateWordCount);
  
      function updateWordCount() {
        if (!editorContent || !wordCount) return;
  
        const text = editorContent.innerText || "";
        const words = text.split(/\s+/).filter((word) => word.length > 0);
        const wordCountNum = words.length;
        const readingTime = Math.ceil(wordCountNum / 200); // Average reading speed
  
        wordCount.textContent = ${wordCountNum} words | ${readingTime} min read;
      }
  
      function updatePreview() {
        if (!editorContent || !previewContent) return;
  
        // Copy content from editor to preview
        previewContent.innerHTML = editorContent.innerHTML;
      }
    }
  
    // Excerpt Character Count
    if (excerptTextarea && excerptCharCount) {
      excerptTextarea.addEventListener("input", function () {
        const length = this.value.length;
        excerptCharCount.textContent = length;
      });
    }
  
    // Form Submission
    if (blogForm) {
      blogForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        // Basic validation
        if (blogTitle.value.trim() === "") {
          alert("Please enter a blog title");
          blogTitle.focus();
          return;
        }
  
        if (categorySelect.value === "") {
          alert("Please select a category");
          categorySelect.focus();
          return;
        }
  
        if (!editorContent.textContent.trim()) {
          alert("Please add some content to your blog");
          editorContent.focus();
          return;
        }
  
        // For a real application, this would submit the form data to the server
        alert("Blog published successfully!");
  
        // Optional: reset form after submission
        // this.reset();
        // imagePreview.innerHTML = '';
        // imagePreview.style.display = 'none';
        // imageEditor.style.display = 'none';
        // tagsWrapper.innerHTML = '';
        // editorContent.innerHTML = '';
        // updateWordCount();
      });
    }
  
    // Save Draft Button
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener("click", function (e) {
        e.preventDefault();
  
        // In a real application, this would save the current state as a draft
        alert("Blog saved as draft");
  
        // For demo, save to localStorage
        const blogData = {
          title: blogTitle.value,
          category: categorySelect.value,
          subcategory: subcategorySelect.value,
          content: editorContent.innerHTML,
          excerpt: excerptTextarea ? excerptTextarea.value : "",
          lastSaved: new Date().toISOString(),
        };
  
        localStorage.setItem("blogDraft", JSON.stringify(blogData));
      });
    }
  
    // Preview Blog Button
    if (previewBlogBtn) {
      previewBlogBtn.addEventListener("click", function (e) {
        e.preventDefault();
  
        // Basic validation
        if (blogTitle.value.trim() === "") {
          alert("Please enter a blog title");
          blogTitle.focus();
          return;
        }
  
        if (!editorContent.textContent.trim()) {
          alert("Please add some content to your blog");
          editorContent.focus();
          return;
        }
  
        // In a real application, this would open a preview page
        alert("Blog preview functionality would be implemented here.");
      });
    }
  
    // Check for saved draft on page load
    function loadSavedDraft() {
      const savedDraft = localStorage.getItem("blogDraft");
      if (savedDraft) {
        try {
          const blogData = JSON.parse(savedDraft);
  
          // Confirm if user wants to load draft
          const loadDraft = confirm(
            "We found a saved draft. Would you like to load it?"
          );
  
          if (loadDraft) {
            // Populate form fields
            blogTitle.value = blogData.title || "";
  
            if (blogData.category) {
              categorySelect.value = blogData.category;
              // Trigger change event to load subcategories
              const event = new Event("change");
              categorySelect.dispatchEvent(event);
  
              // Set subcategory after subcategories are loaded
              setTimeout(() => {
                if (subcategorySelect && blogData.subcategory) {
                  subcategorySelect.value = blogData.subcategory;
                }
              }, 100);
            }
  
            if (editorContent) {
              editorContent.innerHTML = blogData.content || "";
              updateWordCount();
            }
  
            if (excerptTextarea && blogData.excerpt) {
              excerptTextarea.value = blogData.excerpt;
              // Trigger input event to update character count
              const event = new Event("input");
              excerptTextarea.dispatchEvent(event);
            }
  
            // Notify user
            alert(
              `Draft loaded. Last saved: ${new Date(
                blogData.lastSaved
              ).toLocaleString()}`
            );
          }
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
  
    // Load draft when page loads
    loadSavedDraft();
  });