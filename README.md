**RocketElevators Admin React App**

This application serves as a dynamic agent management system that enables real-time interaction with agent data. Users can register, log in, view a list of agents, and manage agent details including additions, updates, and deletions. The app aims to streamline operations for businesses by providing a comprehensive dashboard for overseeing agent activities.

**Built With:**
* React - The front-end framework used
* Node.js and Express - Server setup
* MongoDB - Used for the database
* Vite - Front-end tooling
* TailwindCSS - Used for styling


# **Instructions for Application Setup**


## **Getting Started**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Before you begin, ensure you have the following installed:

node.js - Download and install from https://nodejs.org/
npm - Comes with Node.js
MongoDB - Set up a MongoDB Atlas account or install MongoDB locally

Clone the repository:
git clone https://github.com/yourusername/Full-Stack-Development-2-Module7.git
cd Full-Stack-Development-2-Module7


### **Install NPM packages for both server and client:**

Navigate to the server directory and install dependencies:

cd server\
npm install\
cd ..

Navigate to the client directory and install dependencies:

cd client\
npm install\
cd ..

### **Set up environment variables:**

In the server directory, rename env.txt to .env and update the necessary environment variables such as ATLAS_URI, JWT_SECRET

### **To run the server:**

cd server\
npm start

### **To run the client:**

cd client\
npm run dev

### **Visit the Application:**

Open http://localhost:5173 to view the client in the browser.\
Ensure your server is running on its configured port, http://localhost:3004 or as defined in your .env file. 

# **Usage**

* Login/Register: Start by navigating to the registration page to create a new user account, or log in if you already have credentials.
* Navigate: Use the navigation bar to switch between the agent listing and detailed agent views.
* Manage Agents: Add new agents, edit existing details, or remove agents from the system via the user interface 


# **React Research:**

## **What is the difference between React, React JS, and React Native?**

- **React** is a JavaScript library developed by Facebook for building user interfaces. It focuses on the view layer of applications and can be used to develop both web and mobile applications.
- **React JS** is another term for React, specifically referring to its use in web development. It emphasizes creating interactive UIs in web browsers using components.
- **React Native** is a framework based on React that allows developers to build mobile apps using JavaScript and React. Unlike React JS, which renders components using the DOM in web browsers, React Native uses native mobile UI elements, enabling apps to have a look and feel similar to native iOS and Android applications.

## **Is React a framework or library? What is the difference?**

- **React** is primarily considered a library rather than a framework. The key difference lies in their scope and control:
    - **Library:** Provides specific, reusable pieces of code that developers can incorporate into their applications as needed. It offers flexibility and freedom in how to structure an application but requires more decisions from the developer.
    - **Framework:** Provides a complete solution with a defined way to structure your application. It dictates the architecture and workflow, often leading to less flexibility but quicker development times with more built-in functionalities.
- **React**, being a library, is less opinionated and more focused on the UI component model, leaving other architectural choices, like routing and state management, to the developer or other libraries.

## **HTML and JSX: What Are They And How Do They Differ?**

- **HTML** is a markup language used for structuring content on the web. It uses tags to define elements on a webpage.
- **JSX** is a syntax extension for JavaScript, used in React to describe the UI structure with syntax similar to HTML. The main differences are:
    - JSX allows embedding JavaScript expressions directly within the markup, enclosed in curly braces ({}), whereas HTML does not.
    - JSX components can contain logic and can also represent HTML tags or other React components, making it more powerful and flexible for building complex user interfaces.

## **What makes React attractive for our case?**

- **React** is attractive due to its component-based architecture, which promotes reusable code. It enhances development efficiency and maintainability by allowing individual components to manage their own state. React's virtual DOM (Document Object Model) mechanism provides efficient updating of the web page, leading to high performance even for data-intensive applications. Its strong community support and rich ecosystem of tools can help rapidly develop robust applications.

## **What are some alternative tech stacks to MERN?**

Some popular alternative tech stacks to MERN (MongoDB, Express.js, React, and Node.js) include:
- **MEAN** - MongoDB, Express.js, Angular, and Node.js. This stack uses Angular for building dynamic web applications instead of React.
- **LAMP** - Linux, Apache, MySQL, and PHP. This is one of the oldest and most traditional web development stacks.
- **Django + PostgreSQL** - A Python-based framework that is often paired with PostgreSQL. It is known for its simplicity and efficiency in building complex, data-driven websites.
- **Ruby on Rails + SQLite** - Another powerful combination for rapid web development, using Ruby as the programming language.
- **Flutter + Firebase** - Used primarily for mobile and web applications, where Flutter handles the UI and Firebase offers a host of backend services including real-time databases.

## **Why is MERN a good choice for full stack development?**

- **JavaScript Across the Stack:** Using JavaScript both on the client and server sides can streamline development processes and reduce the context switching for developers.
- **Performance and Scalability:** Node.js allows handling multiple requests simultaneously, making it suitable for high-performance applications. MongoDB offers a flexible, schema-less database that scales easily with large amounts of data.
- **Community and Ecosystem:** All technologies in the MERN stack have strong communities and extensive libraries, which can significantly speed up the development process and problem resolution.
- **End-to-End Solution:** MERN provides a complete set of technologies needed to build and deploy a web application, from front-end to back-end, including a database system.

## **A deeper dive into some react features** 

**In lay terms:**
1. Components:
In React, components are like individual LEGO blocks used to build an app. Each block (or component) represents a specific part of the user interface. For instance, in a website, one block could be a button, another might be a text box, and another could be an image. You can use and reuse these blocks across different parts of your app to create a cohesive look and functionality.

2. Props:
Props (short for "properties") are like instructions or parameters you give to your LEGO blocks. For example, if you have a LEGO block designed to be a button, you might give it props to say "Make the button blue" or "The text on the button should say 'Click me!'". Props help you customize your components by passing information to them.

3. State:
State is similar to a scoreboard in a game; it keeps track of information that can change over time. In React, the state is what allows components to remember things. For instance, if you’re building a game app, the state will keep track of the score as players earn points. It's a way to make the app dynamic and interactive, updating the UI based on user actions or other changes.

**In technical terms:**
1. Components:
In React, components are reusable building blocks coded in JavaScript, which encapsulate the structure, behavior, and style of parts of a user interface. Components can be either class-based or functional. They allow for efficient UI construction through methods like JSX, which looks similar to HTML, enabling developers to describe the structure of the UI in a syntax familiar to many.

2. Props:
Props in React are objects that store the values of attributes from parent components and are passed down to child components. They are immutable within the child component, meaning a component cannot change its own props, but it can be sent callback functions via props to interact with parent data. Props allow for component reuse and customization, facilitating the flow of data and behavior across components in a unidirectional manner (from parent to child).

3. State:
State is a mutable object that is managed within the component and influences what is rendered on the UI. When the state of a component changes, React re-renders the component to reflect the new state in the UI, facilitating features like interactive counters, form inputs, and more. Unlike props, state is local to the component itself and not passed down from parent components, unless explicitly passed as props. State management can be handled in simple cases with React's useState hook, or with more complex state logic handled by useReducer or external libraries like Redux or Context API.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
