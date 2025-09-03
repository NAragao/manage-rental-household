# 🏠 House Management

A simple and elegant system to manage tenants, rooms, and monthly house expenses, with Firebase integration and email automation via n8n.

---

## ✨ Features

*   **Interactive Dashboard:** View and manage monthly expense reports per tenant.
*   **Tenant Management:** Create, edit, activate/deactivate tenants with detailed data.
*   **Room Management:** Create, edit rooms and view their occupancy status.
*   **House Expense Report:** Record and edit general monthly house expenses (gas, water, electricity).
*   **Automatic Expense Calculation:** Calculate and distribute general expenses among active tenants.
*   **Personalized Email Sending:** Select and send expense emails to tenants via n8n.
*   **Secure Authentication:** Protected by user login via Firebase Authentication.
*   **Modern Design:** Appealing and responsive interface with Bootstrap 5.

---

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js and npm:** [Download here](https://nodejs.org/en/download/)
*   **Firebase Account:** A Firebase project configured with **Firestore Database** and **Authentication (Email/Password)** enabled.
*   **n8n Instance (Optional):** For email sending functionality. Can be local or cloud.

---

## ⚙️ Project Setup

Follow these steps to set up the project in your local environment:

1.  **Clone the Repository / Download the Files:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    # OR download the files directly to a folder
    ```

2.  **Install Dependencies:**
    Navigate to the project folder in your terminal and run:
    ```bash
    npm install
    ```

3.  **Configure the `.env` File:**
    This file contains your Firebase credentials and **SHOULD NOT BE SHARED PUBLICLY (e.g., GitHub)**.

    *   Create a copy of the `.env.example` file and rename it to `.env`.
    *   Open the `.env` file and fill in your Firebase credentials. You can find them in your [Firebase Console](https://console.firebase.google.com/) under **Project settings (⚙️) > General > Your apps > Web app > Config**.

    ```env
    API_KEY="YOUR_API_KEY"
    AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    PROJECT_ID="YOUR_PROJECT_ID"
    STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    APP_ID="YOUR_APP_ID"
    MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
    ```

4.  **Configure Firebase Firestore Security Rules:**
    To allow the application to read and write data after login, configure your Firestore rules.

    *   In the [Firebase Console](https://console.firebase.google.com/), go to **Build > Firestore Database > Rules**.
    *   Replace the existing content with the following rules and click **Publish**:

    ```firestore
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          // Allows read and write ONLY if the request comes from an authenticated user.
          allow read, write: if request.auth != null;
        }
      }
    }
    ```

5.  **Create your Admin User in Firebase:**
    *   In the [Firebase Console](https://console.firebase.google.com/), go to **Build > Authentication > Users**.
    *   Click **Add user** and create a user with an email and password. These will be the credentials you use to log in to the application.

---

## ▶️ How to Run the Application

1.  **Start the Server:**
    In the terminal, in the project folder, run:
    ```bash
    node server.js
    ```
    You should see a message like: `Server running at http://localhost:3000`

2.  **Access in Browser:**
    Open your browser and go to:
    [http://localhost:3000](http://localhost:3000)

    You will be redirected to the login page. Use the credentials you created in Firebase.

---

## 📧 n8n Configuration (Optional: For Email Sending)

For the "Send Expense Email" button to work, you need to configure a workflow in n8n:

1.  **Create a New Workflow in n8n:**
    *   Add a **Webhook** node as a trigger.
    *   Copy the **Test URL** that the Webhook node provides you.
    *   Paste this URL into the `N8N_WEBHOOK_URL` variable at the top of the `index.html` script (inside the `<script type="module">` tag).

2.  **Send Test Data from the Application:**
    *   In your web application, go to the Dashboard, click "Send Expense Email", select some reports, and click "Send Emails".
    *   In n8n, in the Webhook node, click **"Fetch test event"**. You should see the data the application sent (an array of `reports` objects, each with report details and `tenantEmail`).

3.  **Build the Email Sending Workflow:**
    *   **Webhook** (Trigger)
    *   **Split In Batches** (to process each email individually, if sending multiple)
        *   `Mode`: `Split In Batches`
        *   `Batch Size`: `1`
    *   **Gmail** (to send the email)
        *   **Credential:** Create a new credential. The most secure way is to use an **App Password** from your Google account. [Google help for creating App Password](https://support.google.com/accounts/answer/185833)
        *   **To:** `{{ $json.tenantEmail }}` (or the email field you obtained from the previous Firebase node)
        *   **Subject:** `House Expenses - Month {{ $json.month }}`
        *   **HTML Body:** You can use a template like this, adapting the `{{ $json.field }}` fields to the data your Webhook is receiving:

        ```html
        <p>Hello {{ $json.tenantName }},</p>
        <p>Here are the details of your expenses for the month of <b>{{ $json.month }}</b>:</p>
        <ul>
            <li>Room Rent: <b>{{ $json.rent }}€</b></li>
            <li>Gas: {{ $json.gas }}€</li>
            <li>Water: {{ $json.water }}€</li>
            <li>Electricity: {{ $json.electricity }}€</li>
        </ul>
        <p>Total to pay: <b>{{ $json.total }}€</b></p>
        <p>Thank you!</p>
        ```
    *   **Activate the Workflow:** After configuring, activate the workflow in n8n.

---

## ⚠️ Common Troubleshooting

*   **`Cannot GET /`:**
    *   Ensure the `server.js` server is running.
    *   Check if the main file is named `index.html` (and not `site.html`).
*   **Login not working / Data not appearing:**
    *   Check the browser console (F12) for errors.
    *   Confirm that your `.env` file is correct and in the project root folder.
    *   Ensure "Email/Password" login method is enabled in Firebase Authentication and that you have created a user.
    *   Check your Firestore rules. They should be `allow read, write: if request.auth != null;` for authenticated users.
*   **`Firebase: Error (auth/invalid-api-key).`:**
    *   Your `API_KEY` in `.env` is incorrect or your Firebase project is not correctly configured for the web.

---