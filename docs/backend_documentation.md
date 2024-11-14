# Backend Documentation

## 1. Database Schema

- **Users**: Stores user information and roles.
- **VINLookups**: Logs each VIN lookup and keycode retrieval.
- **Subscriptions**: Manages user subscription plans and payment status.

## 2. Business Logic

### 2.1. VIN Decoding
- Transforms VIN into a keycode, with access restricted based on user subscription tier.

### 2.2. Keycode Retrieval
- Allows users to retrieve keycodes based on permissions and logs each retrieval in the database.

## 3. APIs

### 3.1. VIN Lookup API
- **Endpoint**: `/vin-lookup`
- **Description**: Retrieve keycode using VIN.
- **Parameters**: 
  - `vin` (string): The Vehicle Identification Number.
  - `user_id` (string): ID of the requesting user.
- **Response**: 
  ```json
  { "keycode": "XXXX" }

### 3.2. Keycode Generation API

-   **Endpoint**: `/keycode-generate`
-   **Description**: Generates details based on keycode.
-   **Parameters**:
    -   `keycode` (string): The keycode to be decoded.
    -   `user_id` (string): ID of the requesting user.
-   **Response**:
    
    json
    
    Copy code
    
    `{ "key_type": "type", "chip_info": "info" }` 
    

## 4. Error Handling

### 4.1. Common Error Codes

-   **401 Unauthorized**: Returned when the user is not authorized to access the requested resource.
-   **404 Not Found**: Returned when the VIN or keycode is not found in the database.
-   **500 Internal Server Error**: Returned for any unexpected server error.
