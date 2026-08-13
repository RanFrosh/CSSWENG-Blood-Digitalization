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

5. Project Structure
    

7. Installation & Setup
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
    Create a .env.local file in the root directory and add the required Supabase credentials:

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

8. Environment Variables


9. Database
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

10. Business Rules
    The system implements business rules to ensure that blood drive transactions are valid and that donors cannot perform restricted actions.

    **Donor Eligibility**
    * A donor must meet the system's eligibility requirements before participating in a blood drive.
    * After a donor successfully completes a donation, their next_eligibility date is calculated based on the event date.
    * The next eligibility date is calculated by adding three months to the date of the successful blood donation.
    * When a donor attempts to participate in another event, the system checks whether the event date is on or after the donor's next_eligibility date.
    
    **Event Participation**
    * A donor cannot successfully donate multiple times for the same event.
    * A donor who has already completed the donation process for an event cannot re-enter the onsite queue.
    * Donor participation is tracked through the donor-to-event relationship.
    
    **Perk Redemption**
    * A donor can only claim the perk associated with a successful donation once.
    * The backend verifies the donor's participation and donation status before allowing a perk to be claimed.
    * Duplicate QR scans for perk redemption are rejected.
    
    **QR Code Verification**
    * QR codes are used to identify donors during onsite processes.
    * The backend validates the donor associated with the scanned QR code before processing the requested action.
    * Scanning a QR code does not automatically authorize an action; the appropriate business rules and permissions must still be satisfied.

    **Blood Collection**
    * Blood collection records are associated with the appropriate donor and event.
    * Blood bag information is recorded after collection, including blood type, volume, quality, outcome, and observations.

11. Security
    Security is implemented through authentication, authorization, server-side validation, and controlled database access.

    **Authentication**
    * Users must authenticate before accessing protected system functionality.
    * Authentication is handled through Supabase Auth.
    * User sessions are used to determine whether a request comes from an authenticated user.

    **Role-Based Authorization**
    The system restricts functionality based on the user's assigned role.
    * Donors can access donor-specific functionality.
    * Onsite Admins can perform onsite event operations.
    * Recovery Staff can perform recovery and perk-related operations.
    * Laboratory Staff can manage blood collection information.
    * Super Admins have access to administrative management and monitoring functions.

    Authorization checks are performed on the backend rather than relying solely on frontend restrictions.

    **Server-Side Validation**
    Important operations are processed through Next.js Server Actions, allowing validation and business rules to be enforced on the server.

    This prevents users from bypassing frontend restrictions by directly manipulating requests or client-side state.

    **Transaction Protection**
    The backend verifies the current database state before performing sensitive operations, such as:
    * Donor check-in
    * Donation completion
    * Perk redemption
    * Queue entry
    * Eligibility verification

    This helps prevent duplicate transactions and unauthorized state changes.

    **Sensitive Information**
    * Database credentials and API keys are stored in environment variables.
    * Secrets must not be committed to the repository.
    * Sensitive operations should not expose unnecessary donor or administrative information to the client.

    **Auditability** 
    Important system and event activities are logged to provide traceability and support administrative monitoring.

12. Testing/QA


13. Contributors

