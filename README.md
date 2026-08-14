# CSSWENG-Blood-Digitalization


1. Project Overview
    This Blood Drive Management System is a web-based application designed to streamline and digitize the process of organizing and managing blood donation drives. It facilitates donor registration, event sign-ups, donor eligibility verification, onsite queue management, blood donation recording, perk redemption, and administrative management.

    The system supports different user roles, including donors, onsite administrators, recovery staff, laboratory staff, and super administrators, with role-specific access and responsibilities. It also maintains event and activity logs to improve traceability, accountability, and security throughout the blood donation process.

    The system aims to reduce manual processes, prevent duplicate or unauthorized transactions, and provide a centralized platform for efficiently managing blood drive operations.


2. User Roles
    The Blood Drive Management System has the following user roles:

    **Donor** 
    – Registers an account, signs up for blood drive events, presents their QR code for verification, and participates in the donation process.

    **Onsite Admin (OA)** 
    – Manages donors during an ongoing blood drive, verifies donor eligibility, handles check-ins, and manages the onsite donor queue.

    **Recovery Staff (RS)** 
    – Handles the post-donation process, records successful donations, verifies donation outcomes, and processes donor perk redemption.

    **Laboratory Staff (LS)** 
    – Records and manages blood collection information, including blood bag details, blood type, volume, collection date, quality, and donation outcome.

    **Super Admin** 
    – Manages system users, events, staff assignments, and administrative data. The super admin can also review system and event activity logs for monitoring and auditing purposes.


3. Tech Stack
    Frontend:           Next.js, React, TypeScript, Tailwind CSS
    Backend:            Next.js Server Actions
    Database:           PostgreSQL via Supabase
    ORM:                Drizzle ORM
    Package Manager:    npm
    Version Control:    Git / GitHub


4. System Architecture
    * Users interact with the system through role-specific interfaces.
    * The Next.js frontend handles the user interface and client-side interactions such as QR scanning and form submission.
    * Next.js Server Actions process requests and enforce authentication, authorization, validation, and business rules.
    * Drizzle ORM provides type-safe communication between the application and the database.
    * Supabase PostgreSQL stores and manages the system's persistent data.
    * The system records relevant activities and transactions in event/system logs to support monitoring and accountability.
    

5. Installation & Setup
    **Prerequisites**
    Before running the Blood Drive Management System, make sure the following are installed:
    * Node.js
    * npm
    * Git
    * A Supabase project with a PostgreSQL database

    **Clone Repository**
    git clone <repository-url>
    cd <project-folder>

    **Install Dependencies**
    npm install

    **Configure Environment Variables**
    Create a .env.local file in the root directory and add the required Supabase credentials

    **Setup the Database**
    Configure the PostgreSQL database through Supabase and ensure that the required database tables, relationships, and constraints are created.

    If the project contains database migrations, run the appropriate migration commands provided by the project.

    **Run the Development Server**
    Start the application with:
    npm run dev

    The application should be accessible at:
    http://localhost:3000

    **Build for Production**
    To create a production build:
    npm run build

    Then start the production server:
    npm start


6. Database
    The Blood Drive Management System uses PostgreSQL through Supabase as its primary database, with Drizzle ORM for type-safe database operations.

    The database stores information related to donors, blood drive events, staff assignments, donations, blood bags, locations, and system activity.

    **Main Entities**
    * Donor – Stores donor information, account details, and eligibility information.
    * Event Log – Stores blood drive event information such as event name, partner, location, date, and schedule.
    * Donor-to-Event – Tracks a donor's participation in a specific blood drive, including donation status and perk claims.
    * Blood Bag – Records collected blood, including blood type, volume, collection date, quality, and outcome.
    * Assigned Staff – Associates staff members with event activities.
    * City – Stores event location information.
    * Corrected Event – Stores corrections or adjustments related to event records.
    * Event Logs / Activity Records – Maintain records of important actions performed within the system.

    The database uses primary keys, foreign keys, constraints, and relationships to maintain data integrity and ensure that records remain properly associated with their respective donors, events, and staff members.


7. Contributors

