# Frontend Documentation

## 1. UI Components

### 1.1. VIN Lookup Form
- **Description**: Input form where users can enter a VIN to retrieve the corresponding keycode.
- **Props**: 
  - `onSubmit` (function): Callback function triggered upon form submission.

### 1.2. Subscription Status
- **Description**: Component displaying the user’s subscription status.
- **Props**: 
  - `subscriptionType` (string): Indicates the user’s subscription level (e.g., "Free", "Basic", "Premium").

### 1.3. Dashboard
- **Description**: Displays recent VIN lookup requests and key details for quick access.

## 2. State Management

### 2.1. React Context
- **Usage**: Manages global states such as user information and authentication status.

### 2.2. React Query
- **Usage**: Caches and fetches server data for efficient API calls, improving the performance of repeated lookups.

## 3. Integration with Backend

### 3.1. VIN Lookup API Integration
- **Description**: The frontend calls the `/vin-lookup` API to fetch keycodes based on the VIN input.
- **Process**:
  - On form submission, the VIN is sent to the backend API.
  - The response is displayed to the user upon successful retrieval.

### 3.2. Keycode Generator API Integration
- **Description**: Connects to the `/keycode-generate` API to decode keycodes into detailed information.
- **Process**:
  - Users input a keycode, which is sent to the backend.
  - The response includes key type and chip details, shown on the frontend.

## 4. Mobile-First Design

### 4.1. Responsiveness
- **Approach**: Uses Tailwind CSS to ensure all components are mobile-friendly and responsive.

### 4.2. Best Practices
- **Guidelines**: Prioritize lightweight components, touch-friendly UI elements, and flexible layouts that adapt to various screen sizes.
