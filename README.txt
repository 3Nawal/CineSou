CineSou Movie Catalog Website
=============================

Author: Nawal A
Project: CineSou - Movie Catalog Web Application  
Date: August 2025  

Description:
------------
CineSou is a responsive, accessible movie catalog website designed to showcase various films in a clean and interactive layout. It features a home page, movie catalog, and contact form. The site follows HTML5 best practices, W3C standards, and WCAG accessibility guidelines.

All movie data is stored in an external XML file (`movies.xml`) and is dynamically loaded using JavaScript. The site also supports a light/dark mode switch with system preference detection and keyboard accessibility.

Project Structure:
------------------
.
├── index.html        - Homepage with welcome message, top movies, and an aside section  
├── catalog.html      - Movie catalog loading XML data dynamically into a table and article sections  
├── contact.html      - Contact form with client-side validation using JavaScript  
├── styles.css        - External CSS for layout, theming, and responsive design  
├── script.js         - Loads and parses XML movie data into HTML  
├── darkmode.js       - Light/dark theme manager with ARIA labels and smooth transitions  
├── movies.xml        - Structured XML file with metadata for movies (title, genre, year, etc.)  
├── README.txt        - Project overview and usage guide (this file)  

How to Run:
-----------
1. Download and unzip the project folder.  
2. Open `index.html` in any modern web browser.  
3. Use the navigation bar to explore the Catalog and Contact pages.  
4. Ensure JavaScript is enabled to dynamically load movie data from the XML file.  
5. Use the theme toggle (☀️ / 🌙) in the top-right corner to switch between light and dark modes.

Features:
---------
- ✅ Fully responsive design using Flexbox and CSS Grid  
- ✅ Semantic HTML5 structure (`header`, `nav`, `section`, `article`, `aside`, `footer`)  
- ✅ Client-side form validation for email/contact fields  
- ✅ Dynamic movie catalog using XML + DOM manipulation via JavaScript  
- ✅ Light/Dark theme toggle with localStorage and system detection  
- ✅ Accessible UI: keyboard navigation, contrast, ARIA roles/labels, skip links  
- ✅ Validated HTML/CSS using W3C Validator

Accessibility:
--------------
- Follows WCAG guidelines for contrast and navigation  
- ARIA roles and labels improve screen reader experience  
- Supports keyboard navigation and focus outlines  
- Responsive for users on both desktop and mobile devices  
- Reduced motion support for users with motion sensitivity  

Contact Form:
-------------
The contact form is fully functional with JavaScript-based client-side validation for empty fields and email format.  
NOTE : The form does not submit data to a server or external service (e.g., Google Forms). It is intended for frontend demonstration only.

License:
--------
This project was created for educational purposes as part of a web development course assignment.  
You may reuse or modify the code with proper attribution.

⚠️ Important: This project must be run on a local server (e.g., VS Code Live Server or Python HTTP server). Opening the HTML file directly via file:// will not load movies.xml due to browser security restrictions.

