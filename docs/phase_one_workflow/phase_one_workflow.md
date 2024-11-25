---
### **Phase One Workflow**

#### User Workflow
1. **Registration/Login**:
  - Users can register by providing their name, email, and password.
  - They can then log in to the system using their credentials.
  - Users are assigned roles: either a `KeycodeUser` or an `AdminUser`.

2. **Requesting a Vehicle Key Code**:
  - Logged-in users can submit vehicle information (make, model, and VIN) to request a key code.
  - A `Vehicle` entity is created for each request, linked to the user who initiated the request.
  - The vehicle request is added to the user's shopping cart (`Cart`) for further action.

3. **Checkout Process**:
  - Users can view their cart and proceed to checkout.
  - Upon checkout, a `Transaction` is created, and the cart is marked as `CHECKED_OUT`.
  - An email notification is sent to both the user and admin using SendGrid, notifying them of the new order.

4. **Cart Management**:
  - Users can add, remove, and view vehicles in their cart before proceeding to checkout.
  - After checkout, the vehicles are no longer present in the cart, and they are now part of a `Transaction`.

#### Admin Workflow
1. **Viewing Pending Requests**:
  - Admins can log in and access an admin dashboard where they see pending vehicle key code requests.
  - These pending requests are fetched from vehicles that have `status = "PENDING"`.

2. **Processing Vehicle Requests**:
  - Admins can enter a key code for each vehicle and fulfill the request.
  - The vehicle status is updated to `"COMPLETED"` and the corresponding transaction status is set to `"FULFILLED"`.
  - The user is notified via email using SendGrid with the key code for their vehicle.
---
