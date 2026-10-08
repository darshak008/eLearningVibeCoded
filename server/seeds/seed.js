require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");
const Quiz = require("../models/Quiz");
const Notification = require("../models/Notification");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

const users = [
  {
    name: "Admin User",
    email: "admin@demo.com",
    password: "password123",
    role: "admin",
    isVerified: true,
    bio: "Platform administrator managing the E-Learning system.",
    headline: "System Administrator",
  },
  {
    name: "Sarah Johnson",
    email: "instructor@demo.com",
    password: "password123",
    role: "instructor",
    isVerified: true,
    bio: "Senior full-stack developer with 10+ years of experience. Passionate about teaching web technologies.",
    headline: "Full-Stack Developer & Educator",
    skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
  },
  {
    name: "Michael Chen",
    email: "instructor2@demo.com",
    password: "password123",
    role: "instructor",
    isVerified: true,
    bio: "Data scientist and ML engineer. Former tech lead at major tech companies.",
    headline: "Data Scientist & ML Engineer",
    skills: ["Python", "Machine Learning", "Data Science", "TensorFlow"],
  },
  {
    name: "Alex Rivera",
    email: "student@demo.com",
    password: "password123",
    role: "student",
    isVerified: true,
    bio: "Computer science student passionate about web development.",
    headline: "CS Student",
    interests: ["Web Development", "React", "UI/UX"],
  },
  {
    name: "Emily Watson",
    email: "student2@demo.com",
    password: "password123",
    role: "student",
    isVerified: true,
    bio: "Aspiring data analyst looking to learn Python and data visualization.",
    headline: "Aspiring Data Analyst",
    interests: ["Data Science", "Python", "Analytics"],
  },
];

const categories = [
  { name: "Development", description: "Learn to code and build applications" },
  { name: "Design", description: "UI/UX, graphic design, and creative skills" },
  { name: "Business", description: "Entrepreneurship, management, and strategy" },
  { name: "Marketing", description: "Digital marketing, SEO, and growth hacking" },
  { name: "IT & Software", description: "System administration, networking, and DevOps" },
  { name: "Photography", description: "Photography techniques and editing" },
  { name: "Music", description: "Music production and theory" },
  { name: "Health & Fitness", description: "Wellness, exercise, and nutrition" },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected.\n");

    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
      Review.deleteMany({}),
      Quiz.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("Data cleared.\n");

    console.log("Creating users...");
    const createdUsers = await User.create(users);
    const [admin, instructor1, instructor2, student1, student2] = createdUsers;
    console.log(`  Created ${createdUsers.length} users.`);

    console.log("Creating categories...");
    const createdCategories = await Category.create(categories);
    const [devCat, designCat, bizCat, marketCat, itCat, photoCat, musicCat, healthCat] =
      createdCategories;
    console.log(`  Created ${createdCategories.length} categories.`);

    console.log("Creating courses...");
    const coursesData = [
      {
        title: "Complete Web Development Bootcamp 2024",
        description:
          "Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, MongoDB, and build real-world projects. This comprehensive course covers everything you need to become a full-stack developer.",
        shortDescription: "Go from zero to hero in web development with hands-on projects.",
        price: 89.99,
        discountPrice: 12.99,
        category: devCat._id,
        instructor: instructor1._id,
        level: "beginner",
        language: "English",
        outcomes: [
          "Build 16 web development projects for your portfolio",
          "Learn the latest technologies: HTML5, CSS3, JavaScript ES6+",
          "Master React.js and build complex applications",
          "Create server-side applications with Node.js and Express",
          "Work with MongoDB and Mongoose for database management",
        ],
        requirements: [
          "No programming experience needed - I'll teach you everything",
          "A computer with internet access",
        ],
        targetAudience: [
          "Complete beginners with no programming experience",
          "Developers looking to learn new frameworks",
          "Anyone who wants to learn web development",
        ],
        tags: ["javascript", "react", "nodejs", "web development", "fullstack"],
        isPublished: true,
        isFeatured: true,
        totalStudents: 2,
        avgRating: 4.5,
        totalReviews: 2,
        totalModules: 3,
        totalLessons: 8,
      },
      {
        title: "Advanced React and Redux Masterclass",
        description:
          "Take your React skills to the next level. Deep dive into advanced patterns, Redux Toolkit, React Router, custom hooks, performance optimization, and testing strategies used in production applications.",
        shortDescription: "Master advanced React patterns and state management with Redux.",
        price: 79.99,
        discountPrice: 0,
        category: devCat._id,
        instructor: instructor1._id,
        level: "advanced",
        language: "English",
        outcomes: [
          "Master advanced React design patterns",
          "Implement complex state management with Redux Toolkit",
          "Build performant applications with optimization techniques",
          "Write comprehensive tests for React applications",
        ],
        requirements: [
          "Solid understanding of React fundamentals",
          "JavaScript ES6+ knowledge",
          "Node.js and npm installed",
        ],
        targetAudience: [
          "React developers looking to level up",
          "Frontend developers wanting to master state management",
        ],
        tags: ["react", "redux", "javascript", "advanced", "frontend"],
        isPublished: true,
        isFeatured: true,
        totalStudents: 1,
        avgRating: 4.8,
        totalReviews: 1,
        totalModules: 2,
        totalLessons: 5,
      },
      {
        title: "UI/UX Design Fundamentals",
        description:
          "Learn the principles of great user interface and user experience design. From wireframing to prototyping, master Figma and create designs that users love.",
        shortDescription: "Create stunning user interfaces and seamless user experiences.",
        price: 69.99,
        discountPrice: 9.99,
        category: designCat._id,
        instructor: instructor1._id,
        level: "beginner",
        language: "English",
        outcomes: [
          "Understand core UI/UX design principles",
          "Create wireframes and prototypes in Figma",
          "Conduct user research and usability testing",
          "Build a professional design portfolio",
        ],
        requirements: [
          "No design experience required",
          "A computer with internet access",
        ],
        targetAudience: [
          "Aspiring UI/UX designers",
          "Developers wanting to improve design skills",
        ],
        tags: ["ui", "ux", "figma", "design", "prototyping"],
        isPublished: true,
        isFeatured: false,
        totalStudents: 1,
        avgRating: 4.2,
        totalReviews: 1,
        totalModules: 2,
        totalLessons: 4,
      },
      {
        title: "Python for Data Science and Machine Learning",
        description:
          "Master Python programming for data science. Learn NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Build real machine learning models and data pipelines.",
        shortDescription: "Harness the power of Python for data analysis and ML.",
        price: 94.99,
        discountPrice: 19.99,
        category: devCat._id,
        instructor: instructor2._id,
        level: "intermediate",
        language: "English",
        outcomes: [
          "Write Python code for data analysis",
          "Create stunning data visualizations",
          "Build and evaluate machine learning models",
          "Work with real-world datasets",
        ],
        requirements: [
          "Basic programming knowledge",
          "Python installed on your computer",
          "High school math fundamentals",
        ],
        targetAudience: [
          "Anyone interested in data science",
          "Python developers wanting to learn ML",
          "Analysts transitioning to data science",
        ],
        tags: ["python", "data science", "machine learning", "tensorflow", "pandas"],
        isPublished: true,
        isFeatured: true,
        totalStudents: 1,
        avgRating: 4.6,
        totalReviews: 1,
        totalModules: 2,
        totalLessons: 5,
      },
      {
        title: "Digital Marketing Masterclass",
        description:
          "Complete guide to digital marketing. Learn SEO, social media marketing, Google Ads, email marketing, content strategy, and analytics. Grow any business online.",
        shortDescription: "Everything you need to master digital marketing and grow online.",
        price: 74.99,
        discountPrice: 0,
        category: marketCat._id,
        instructor: instructor2._id,
        level: "all-levels",
        language: "English",
        outcomes: [
          "Create and manage effective marketing campaigns",
          "Master SEO and content marketing",
          "Run profitable Google Ads and social media campaigns",
          "Analyze marketing data and optimize ROI",
        ],
        requirements: [
          "No prior marketing experience needed",
          "Willingness to learn and apply strategies",
        ],
        targetAudience: [
          "Business owners wanting to grow online",
          "Marketing professionals looking to upskill",
          "Anyone interested in digital marketing",
        ],
        tags: ["marketing", "seo", "google ads", "social media", "analytics"],
        isPublished: true,
        isFeatured: false,
        totalStudents: 0,
        avgRating: 0,
        totalReviews: 0,
        totalModules: 2,
        totalLessons: 4,
      },
    ];

    const createdCourses = await Course.create(coursesData);
    const [course1, course2, course3, course4, course5] = createdCourses;
    console.log(`  Created ${createdCourses.length} courses.`);

    console.log("Creating modules and lessons...");

    const modulesData = [
      // Course 1 modules
      {
        course: course1._id,
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of the web.",
        order: 1,
      },
      {
        course: course1._id,
        title: "JavaScript Essentials",
        description: "Master JavaScript programming.",
        order: 2,
      },
      {
        course: course1._id,
        title: "Introduction to React",
        description: "Build modern UIs with React.",
        order: 3,
      },
      // Course 2 modules
      {
        course: course2._id,
        title: "Advanced React Patterns",
        description: "Learn advanced React design patterns.",
        order: 1,
      },
      {
        course: course2._id,
        title: "Redux Toolkit Deep Dive",
        description: "Master state management with Redux.",
        order: 2,
      },
      // Course 3 modules
      {
        course: course3._id,
        title: "Design Principles & Theory",
        description: "Core principles of UI/UX design.",
        order: 1,
      },
      {
        course: course3._id,
        title: "Figma for Beginners",
        description: "Hands-on Figma prototyping.",
        order: 2,
      },
      // Course 4 modules
      {
        course: course4._id,
        title: "Python Data Analysis",
        description: "NumPy, Pandas, and data wrangling.",
        order: 1,
      },
      {
        course: course4._id,
        title: "Machine Learning Fundamentals",
        description: "Intro to ML with Scikit-learn.",
        order: 2,
      },
      // Course 5 modules
      {
        course: course5._id,
        title: "SEO & Content Marketing",
        description: "Rank higher and create engaging content.",
        order: 1,
      },
      {
        course: course5._id,
        title: "Social Media & Paid Ads",
        description: "Master social media and paid advertising.",
        order: 2,
      },
    ];

    const createdModules = await Module.create(modulesData);
    const [
      m1c1,
      m2c1,
      m3c1,
      m1c2,
      m2c2,
      m1c3,
      m2c3,
      m1c4,
      m2c4,
      m1c5,
      m2c5,
    ] = createdModules;
    console.log(`  Created ${createdModules.length} modules.`);

    const lessonsData = [
      // Course 1 - Module 1 lessons
      {
        module: m1c1._id,
        course: course1._id,
        title: "Introduction to HTML",
        description: "Learn HTML tags, elements, and document structure.",
        duration: 720,
        order: 1,
        isFree: true,
        content:
          "HTML (HyperText Markup Language) is the standard markup language for creating web pages. In this lesson, you will learn about HTML elements, tags, attributes, and how to structure a web document.",
      },
      {
        module: m1c1._id,
        course: course1._id,
        title: "CSS Styling Basics",
        description: "Style your web pages with CSS selectors and properties.",
        duration: 900,
        order: 2,
        isFree: true,
        content:
          "CSS (Cascading Style Sheets) is used to style and layout web pages. Learn about selectors, the box model, flexbox, and grid.",
      },
      {
        module: m1c1._id,
        course: course1._id,
        title: "Responsive Design with Media Queries",
        description: "Make your websites responsive for all devices.",
        duration: 840,
        order: 3,
        isFree: false,
        content:
          "Responsive design ensures your website looks great on all screen sizes. Learn media queries, mobile-first design, and responsive frameworks.",
      },
      // Course 1 - Module 2 lessons
      {
        module: m2c1._id,
        course: course1._id,
        title: "JavaScript Variables and Data Types",
        description: "Understand variables, data types, and operators.",
        duration: 660,
        order: 1,
        isFree: false,
        content:
          "Learn about let, const, var, primitive types, objects, arrays, and type coercion in JavaScript.",
      },
      {
        module: m2c1._id,
        course: course1._id,
        title: "Functions and Scope",
        description: "Master function declarations, expressions, and closures.",
        duration: 780,
        order: 2,
        isFree: false,
        content:
          "Functions are building blocks of JavaScript. Learn function declarations, arrow functions, closures, and scope.",
      },
      {
        module: m2c1._id,
        course: course1._id,
        title: "DOM Manipulation",
        description: "Interact with the Document Object Model.",
        duration: 900,
        order: 3,
        isFree: false,
        content:
          "Learn how to select, create, modify, and delete DOM elements using JavaScript.",
      },
      // Course 1 - Module 3 lessons
      {
        module: m3c1._id,
        course: course1._id,
        title: "React Components and JSX",
        description: "Build your first React components.",
        duration: 840,
        order: 1,
        isFree: false,
        content:
          "Components are the heart of React. Learn JSX syntax, functional components, and how to compose UIs.",
      },
      {
        module: m3c1._id,
        course: course1._id,
        title: "State and Props",
        description: "Manage component data with state and props.",
        duration: 960,
        order: 2,
        isFree: false,
        content:
          "Learn how to pass data between components with props and manage internal state with useState.",
      },
      // Course 2 - Module 1 lessons
      {
        module: m1c2._id,
        course: course2._id,
        title: "Compound Components Pattern",
        description: "Build flexible component APIs with compound components.",
        duration: 1020,
        order: 1,
        isFree: true,
        content:
          "The compound components pattern allows you to create flexible and reusable component APIs using React Context.",
      },
      {
        module: m1c2._id,
        course: course2._id,
        title: "Render Props and HOCs",
        description: "Learn alternative patterns for code reuse.",
        duration: 900,
        order: 2,
        isFree: false,
        content:
          "Render props and higher-order components are patterns for sharing logic between React components.",
      },
      {
        module: m1c2._id,
        course: course2._id,
        title: "Custom Hooks Deep Dive",
        description: "Extract complex logic into reusable hooks.",
        duration: 840,
        order: 3,
        isFree: false,
        content:
          "Custom hooks let you extract component logic into reusable functions. Learn patterns for building custom hooks.",
      },
      // Course 2 - Module 2 lessons
      {
        module: m2c2._id,
        course: course2._id,
        title: "Redux Toolkit Fundamentals",
        description: "Set up Redux with RTK slices and store.",
        duration: 1100,
        order: 1,
        isFree: false,
        content:
          "Redux Toolkit simplifies Redux development. Learn about slices, the store, and dispatching actions.",
      },
      {
        module: m2c2._id,
        course: course2._id,
        title: "Async Logic with createAsyncThunk",
        description: "Handle API calls and side effects in Redux.",
        duration: 960,
        order: 2,
        isFree: false,
        content:
          "createAsyncThunk handles async logic in Redux. Learn to fetch data, handle loading states, and manage errors.",
      },
      // Course 3 - Module 1 lessons
      {
        module: m1c3._id,
        course: course3._id,
        title: "Color Theory and Typography",
        description: "Master the fundamentals of visual design.",
        duration: 720,
        order: 1,
        isFree: true,
        content:
          "Color and typography are foundational to great design. Learn color harmonies, contrast, font pairing, and hierarchy.",
      },
      {
        module: m1c3._id,
        course: course3._id,
        title: "Layout and Visual Hierarchy",
        description: "Organize content for maximum impact.",
        duration: 660,
        order: 2,
        isFree: false,
        content:
          "Learn about layout principles, whitespace, visual hierarchy, and how to guide the user's eye through your design.",
      },
      // Course 3 - Module 2 lessons
      {
        module: m2c3._id,
        course: course3._id,
        title: "Getting Started with Figma",
        description: "Set up your Figma workspace and learn the basics.",
        duration: 600,
        order: 1,
        isFree: false,
        content:
          "Figma is the industry-standard design tool. Learn to navigate the interface, use frames, and create basic shapes.",
      },
      {
        module: m2c3._id,
        course: course3._id,
        title: "Prototyping and Interactions",
        description: "Create interactive prototypes in Figma.",
        duration: 780,
        order: 2,
        isFree: false,
        content:
          "Learn to create interactive prototypes with transitions, animations, and micro-interactions in Figma.",
      },
      // Course 4 - Module 1 lessons
      {
        module: m1c4._id,
        course: course4._id,
        title: "NumPy Arrays and Operations",
        description: "Master numerical computing with NumPy.",
        duration: 900,
        order: 1,
        isFree: true,
        content:
          "NumPy is the foundation of scientific computing in Python. Learn arrays, broadcasting, and vectorized operations.",
      },
      {
        module: m1c4._id,
        course: course4._id,
        title: "Data Wrangling with Pandas",
        description: "Clean, transform, and analyze data with Pandas.",
        duration: 1020,
        order: 2,
        isFree: false,
        content:
          "Pandas provides powerful data structures for data manipulation. Learn DataFrames, indexing, groupby, and merging.",
      },
      {
        module: m1c4._id,
        course: course4._id,
        title: "Data Visualization",
        description: "Create compelling charts and graphs.",
        duration: 840,
        order: 3,
        isFree: false,
        content:
          "Learn to create beautiful visualizations with Matplotlib and Seaborn to communicate data insights effectively.",
      },
      // Course 4 - Module 2 lessons
      {
        module: m2c4._id,
        course: course4._id,
        title: "Supervised Learning",
        description: "Build classification and regression models.",
        duration: 1200,
        order: 1,
        isFree: false,
        content:
          "Learn linear regression, logistic regression, decision trees, random forests, and SVMs with Scikit-learn.",
      },
      {
        module: m2c4._id,
        course: course4._id,
        title: "Model Evaluation and Tuning",
        description: "Evaluate and optimize your ML models.",
        duration: 960,
        order: 2,
        isFree: false,
        content:
          "Learn cross-validation, hyperparameter tuning, confusion matrices, ROC curves, and model selection.",
      },
      // Course 5 - Module 1 lessons
      {
        module: m1c5._id,
        course: course5._id,
        title: "SEO Fundamentals",
        description: "Rank higher on Google with SEO best practices.",
        duration: 840,
        order: 1,
        isFree: true,
        content:
          "Search Engine Optimization helps your website rank higher. Learn keyword research, on-page SEO, and technical SEO.",
      },
      {
        module: m1c5._id,
        course: course5._id,
        title: "Content Marketing Strategy",
        description: "Create content that attracts and converts.",
        duration: 720,
        order: 2,
        isFree: false,
        content:
          "Content marketing builds trust and drives traffic. Learn to plan, create, and distribute valuable content.",
      },
      // Course 5 - Module 2 lessons
      {
        module: m2c5._id,
        course: course5._id,
        title: "Social Media Marketing",
        description: "Grow your brand on social platforms.",
        duration: 780,
        order: 1,
        isFree: false,
        content:
          "Learn to create engaging social media campaigns on Instagram, LinkedIn, Twitter, and TikTok.",
      },
      {
        module: m2c5._id,
        course: course5._id,
        title: "Google Ads and PPC",
        description: "Run profitable pay-per-click campaigns.",
        duration: 900,
        order: 2,
        isFree: false,
        content:
          "Master Google Ads: keyword targeting, ad copy, bidding strategies, and conversion tracking.",
      },
    ];

    const createdLessons = await Lesson.create(lessonsData);
    console.log(`  Created ${createdLessons.length} lessons.`);

    console.log("Creating enrollments...");
    const enrollmentsData = [
      {
        student: student1._id,
        course: course1._id,
        progress: 37,
        completedLessons: [createdLessons[0]._id, createdLessons[1]._id],
        currentLesson: createdLessons[2]._id,
        lastAccessed: new Date(),
      },
      {
        student: student1._id,
        course: course2._id,
        progress: 20,
        completedLessons: [createdLessons[8]._id],
        currentLesson: createdLessons[9]._id,
        lastAccessed: new Date(),
      },
      {
        student: student2._id,
        course: course1._id,
        progress: 25,
        completedLessons: [createdLessons[0]._id],
        currentLesson: createdLessons[1]._id,
        lastAccessed: new Date(),
      },
      {
        student: student2._id,
        course: course4._id,
        progress: 33,
        completedLessons: [createdLessons[17]._id],
        currentLesson: createdLessons[18]._id,
        lastAccessed: new Date(),
      },
    ];

    const createdEnrollments = await Enrollment.create(enrollmentsData);
    console.log(`  Created ${createdEnrollments.length} enrollments.`);

    console.log("Creating reviews...");
    const reviewsData = [
      {
        student: student1._id,
        course: course1._id,
        rating: 5,
        review:
          "Amazing course! Sarah explains everything so clearly. The projects are practical and I learned so much. Highly recommend for beginners!",
      },
      {
        student: student1._id,
        course: course2._id,
        rating: 5,
        review:
          "This course took my React skills to the next level. The advanced patterns section is gold. Worth every penny.",
      },
      {
        student: student2._id,
        course: course1._id,
        rating: 4,
        review:
          "Very comprehensive course. I would have liked more exercises, but the content quality is excellent.",
      },
      {
        student: student2._id,
        course: course4._id,
        rating: 5,
        review:
          "Michael is an incredible teacher. The machine learning section is thorough and easy to follow. Best Python course I've taken.",
      },
    ];

    const createdReviews = await Review.create(reviewsData);
    console.log(`  Created ${createdReviews.length} reviews.`);

    console.log("Creating quizzes...");
    const quizzesData = [
      {
        course: course1._id,
        lesson: createdLessons[3]._id,
        title: "JavaScript Basics Quiz",
        description: "Test your knowledge of JavaScript fundamentals.",
        timeLimit: 15,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            type: "mcq",
            question: "Which keyword declares a block-scoped variable that can be reassigned?",
            options: ["var", "let", "const", "define"],
            correctAnswer: "let",
            points: 1,
            explanation: "'let' declares a block-scoped variable that can be reassigned. 'const' is also block-scoped but cannot be reassigned.",
          },
          {
            type: "mcq",
            question: "What does '===' check in JavaScript?",
            options: [
              "Value equality only",
              "Type equality only",
              "Value and type equality",
              "Reference equality",
            ],
            correctAnswer: "Value and type equality",
            points: 1,
            explanation: "The strict equality operator (===) checks both value and type without type coercion.",
          },
          {
            type: "true-false",
            question: "JavaScript is a statically-typed language.",
            correctAnswer: "false",
            points: 1,
            explanation: "JavaScript is dynamically typed. Variable types are determined at runtime, not compile time.",
          },
          {
            type: "mcq",
            question: "What is the output of typeof null?",
            options: ["null", "undefined", "object", "boolean"],
            correctAnswer: "object",
            points: 1,
            explanation: "This is a well-known bug in JavaScript that has existed since the language was created.",
          },
        ],
      },
      {
        course: course1._id,
        title: "HTML & CSS Fundamentals Quiz",
        description: "Test your understanding of HTML and CSS.",
        timeLimit: 10,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            type: "mcq",
            question: "Which HTML tag is used for the largest heading?",
            options: ["<heading>", "<h6>", "<h1>", "<head>"],
            correctAnswer: "<h1>",
            points: 1,
          },
          {
            type: "mcq",
            question: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style System",
              "Colorful Style Sheets",
            ],
            correctAnswer: "Cascading Style Sheets",
            points: 1,
          },
          {
            type: "true-false",
            question: "The <div> element is a block-level element.",
            correctAnswer: "true",
            points: 1,
          },
        ],
      },
      {
        course: course4._id,
        lesson: createdLessons[17]._id,
        title: "NumPy Basics Quiz",
        description: "Test your NumPy knowledge.",
        timeLimit: 10,
        passingScore: 60,
        maxAttempts: 3,
        questions: [
          {
            type: "mcq",
            question: "How do you create a NumPy array?",
            options: [
              "np.array([1,2,3])",
              "np.newArray([1,2,3])",
              "np.create([1,2,3])",
              "np.init([1,2,3])",
            ],
            correctAnswer: "np.array([1,2,3])",
            points: 1,
          },
          {
            type: "mcq",
            question: "What is the default data type of np.array([1, 2, 3])?",
            options: ["int32", "int64", "float64", "object"],
            correctAnswer: "int64",
            points: 1,
          },
        ],
      },
    ];

    const createdQuizzes = await Quiz.create(quizzesData);
    console.log(`  Created ${createdQuizzes.length} quizzes.`);

    console.log("Creating notifications...");
    const notificationsData = [
      {
        user: student1._id,
        type: "enrollment",
        title: "Enrolled in Course",
        message: "You have been enrolled in 'Complete Web Development Bootcamp 2024'.",
        link: `/courses/${course1.slug}`,
      },
      {
        user: student1._id,
        type: "enrollment",
        title: "Enrolled in Course",
        message: "You have been enrolled in 'Advanced React and Redux Masterclass'.",
        link: `/courses/${course2.slug}`,
      },
      {
        user: student2._id,
        type: "enrollment",
        title: "Enrolled in Course",
        message: "You have been enrolled in 'Complete Web Development Bootcamp 2024'.",
        link: `/courses/${course1.slug}`,
      },
      {
        user: instructor1._id,
        type: "review",
        title: "New Review",
        message: "Alex Rivera left a 5-star review on 'Complete Web Development Bootcamp 2024'.",
      },
      {
        user: instructor1._id,
        type: "review",
        title: "New Review",
        message: "Alex Rivera left a 5-star review on 'Advanced React and Redux Masterclass'.",
      },
      {
        user: instructor2._id,
        type: "review",
        title: "New Review",
        message: "Emily Watson left a 5-star review on 'Python for Data Science and Machine Learning'.",
      },
      {
        user: student1._id,
        type: "achievement",
        title: "Achievement Unlocked!",
        message: "You completed your first lesson! Keep up the great work.",
        isRead: true,
      },
    ];

    const createdNotifications = await Notification.create(notificationsData);
    console.log(`  Created ${createdNotifications.length} notifications.`);

    console.log("\n--- Seed Complete ---\n");
    console.log("Demo Credentials:");
    console.log("  Admin:      admin@demo.com / password123");
    console.log("  Instructor: instructor@demo.com / password123");
    console.log("  Instructor: instructor2@demo.com / password123");
    console.log("  Student:    student@demo.com / password123");
    console.log("  Student:    student2@demo.com / password123");
    console.log("\nSummary:");
    console.log(`  Users:       ${createdUsers.length}`);
    console.log(`  Categories:  ${createdCategories.length}`);
    console.log(`  Courses:     ${createdCourses.length}`);
    console.log(`  Modules:     ${createdModules.length}`);
    console.log(`  Lessons:     ${createdLessons.length}`);
    console.log(`  Enrollments: ${createdEnrollments.length}`);
    console.log(`  Reviews:     ${createdReviews.length}`);
    console.log(`  Quizzes:     ${createdQuizzes.length}`);
    console.log(`  Notifications: ${createdNotifications.length}`);
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
    process.exit(0);
  }
}

seed();
