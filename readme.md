# Life Series SMP Website Design Outline

### Overview
The website's goal is to provide a clean, easy way for users to access episodes from the Minecraft Life Series SMP. Users will also be able to contribute by adding new episode links or adding new players. The design will focus on accessibility and usability without requiring user authentication while implementing protections against harmful user actions.

### High-Level Stages of Design and Build

1. **Requirement Analysis and Database Design**  
   - Define key tables: `Series`, `Hermit`, `Video`, and optionally `Episode`.
   - Establish relationships among tables (e.g., `Video` references `Hermit` and `Series`).
   - Decide on data fields, relationships, and the format of each table.
   - Set up MySQL database on Ionas 1&1 hosting.

2. **Back-End Architecture**  
   - **PHP Scripting**: Develop PHP files for CRUD operations.
     - Create functions to retrieve and save data to the database, ensuring data validation and sanitation.
     - Establish data-retrieval logic to construct tables dynamically based on series and episode information.
   - **API Design**: Design lightweight endpoints for interaction between front-end and back-end (e.g., get episode data, add episode).

3. **Front-End Layout and Structure**  
   - **HTML/CSS/JS Design**
     - Create a minimal and modern layout suitable for both mobile and desktop.
     - Develop a responsive header for easy navigation.
     - Use CSS Grid or Flexbox to design dynamic tables with episodes per series.
   - **Data Representation**
     - Use JavaScript to fetch and render data from the PHP back-end.
     - Represent episode tables with header rows for episode numbers and user names in the leftmost column.

4. **User Interaction Features**  
   - **Adding Hermits/Episodes**
     - Add buttons under each table allowing users to add new hermits or episode columns.
     - Create simple, unobtrusive pop-ups or modals for these actions, requiring data input (e.g., video URL).
     - Make sure all new data inputs are verified for correctness (i.e., valid YouTube links).
   - **Episode Image Handling**
     - Set initial images to B&W by default.
     - When a user adds a link for an episode, swap the B&W image for a colored version.

5. **Security and Safety Measures**  
   - **User Input Validation**
     - Ensure PHP and JavaScript validation for all data entries to mitigate SQL injection or XSS attacks.
     - Implement a simple CAPTCHA or similar mechanism to avoid bot attacks while keeping usability high.
   - **Content Moderation**
     - Set up a lightweight moderation mechanism, such as a hidden page to review recent changes.
     - Use basic logging for any changes made.

6. **Testing and Optimization**  
   - **Mobile Testing**: Ensure mobile-first design, testing on both small screens and desktops.
   - **Database Load and Usability Testing**: Simulate user actions to test data handling.
   - **User Testing**: Get feedback from potential users for usability and ease of navigation.

7. **Deployment and Maintenance**  
   - Set up the website on Ionas 1&1 hosting.
   - Develop a simple backup strategy for the database.
   - Plan periodic reviews for any bugs or user feedback, especially concerning the content moderation system.

### Suggested Steps to Follow:

1. **Database Design** (Tables, relationships)  
2. **Set Up Back-End** (PHP scripts, database CRUD operations)  
3. **Create Front-End Layout** (HTML/CSS/JS, structure for episode tables)  
4. **Develop User Interaction Features** (Adding hermits, episodes, input modals)  
5. **Implement Security Features** (CAPTCHA, data validation)  
6. **Testing** (Mobile testing, load testing, user testing)  
7. **Deploy and Monitor** (Launch site, track issues, maintenance strategy)

This structured plan should help in organizing the development and ensure the design meets the intended goals. Let me know if you want to explore any of these stages in more detail!

