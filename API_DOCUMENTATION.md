# 🚀 ISP Support Portal - API Documentation

## 📍 Base URL
`https://cms.webspires.com.pk/api`

## 🔑 Authentication
The API uses **Laravel Sanctum**. To access protected data, follow these steps:
1.  **Login**: Call the `/auth/login` endpoint to receive an `access_token`.
2.  **Headers**: Include the token in the header of every subsequent request.
    *   `Authorization: Bearer {YOUR_TOKEN}`
    *   `Accept: application/json`

---

## 🔐 1. Authentication Endpoints

### **Login**
*   **Method**: `POST`
*   **Endpoint**: `/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "admin@isp.com",
      "password": "password"
    }
    ```
*   **Success Response**:
    ```json
    {
      "access_token": "1|xyz123...",
      "token_type": "Bearer",
      "user": { "id": 1, "name": "Super Admin", "role": "super_admin" }
    }
    ```

---

## 📋 2. Leads Management

### **Get All Leads**
*   **Method**: `GET`
*   **Endpoint**: `/leads`
*   **Optional Query Params**:
    *   `status`: (open, resolved)
    *   `lead_type`: (new_connection, complaint)
    *   `search`: (searches name or phone)
*   **Description**: Returns a paginated list of leads. SuperAdmins see all; Staff see their company's leads.

### **Create New Lead**
*   **Method**: `POST`
*   **Endpoint**: `/leads`
*   **Body (JSON)**:
    ```json
    {
      "lead_type": "new_connection",
      "customer_name": "John Doe",
      "phone": "0123456789",
      "address": "123 Street Name",
      "priority": "high"
    }
    ```
    *(Note: `priority` can be: low, medium, high, urgent)*

---

## 📜 3. Activity Logs (Audit Trail)

### **Get System Logs**
*   **Method**: `GET`
*   **Endpoint**: `/logs`
*   **Optional Query Params**:
    *   `date`: YYYY-MM-DD (e.g., `2026-02-01`)
*   **Response Structure**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "action": "Created Lead",
          "description": "Created lead for customer: John Doe",
          "created_at": "2026-02-01T12:00:00Z",
          "user": { "name": "Admin Name" }
        }
      ]
    }
    ```

---

## 🔔 4. Notifications

### **Fetch My Notifications**
*   **Method**: `GET`
*   **Endpoint**: `/notifications`
*   **Description**: Get alerts for new lead assignments or status changes.

### **Mark as Read**
*   **Method**: `PATCH`
*   **Endpoint**: `/notifications/{id}/read`

---

## 💡 Developer Notes:
*   **Paging**: Most `GET` endpoints are paginated. Look for the `next_page_url` and `prev_page_url` keys in the JSON response.
*   **Error Codes**:
    *   `401`: Unauthorized (Token missing or expired).
    *   `422`: Validation Error (Check your JSON data).
    *   `500`: Server Error (Contact Server Admin).
