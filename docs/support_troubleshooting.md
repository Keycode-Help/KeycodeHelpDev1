# Support & Troubleshooting

## 1. Common Issues

### 1.1. Database Connection Failed
- **Description**: Error encountered when the application cannot connect to the PostgreSQL database.
- **Solution**: 
  - Ensure that PostgreSQL is running on the specified port.
  - Verify that database credentials in the `.env.local` file are correct.
  - Restart the application after verifying settings.

### 1.2. Unable to Retrieve Keycode
- **Description**: The VIN lookup returns an error or does not provide a keycode.
- **Solution**:
  - Confirm that the VIN format is correct (17 characters, no special symbols).
  - Ensure the user has the appropriate subscription level to access this feature.

### 1.3. Authentication Issues
- **Description**: Users may experience difficulties logging in or accessing certain features.
- **Solution**:
  - Verify that Firebase Authentication is properly configured in Firebase Console.
  - Ensure that any required user permissions are set up correctly for specific roles.

## 2. Error Codes

### 2.1. 401 Unauthorized
- **Cause**: The user is not authorized to access the requested resource.
- **Solution**: 
  - Check that the user is logged in and has the correct role for accessing the resource.
  - Confirm that the access token (if used) is valid and not expired.

### 2.2. 404 Not Found
- **Cause**: The requested VIN or keycode is not available in the database.
- **Solution**:
  - Verify that the VIN is entered correctly.
  - Confirm that the requested keycode exists and is available for the current user level.

### 2.3. 500 Internal Server Error
- **Cause**: An unexpected error occurred on the server.
- **Solution**: 
  - Retry the request. If the issue persists, contact support with detailed steps to reproduce the error.

## 3. C
