# Clear Browser Cache Instructions

## 🧹 Clear Browser Cache for Development

### **Chrome/Edge:**

1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "All time" for time range
3. Check "Cached images and files"
4. Click "Clear data"

### **Firefox:**

1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Everything" for time range
3. Check "Cache"
4. Click "Clear Now"

### **Safari:**

1. Go to Safari > Preferences > Privacy
2. Click "Manage Website Data"
3. Click "Remove All"

## 🔧 Hard Refresh

- **Windows/Linux:** `Ctrl+F5` or `Ctrl+Shift+R`
- **Mac:** `Cmd+Shift+R`

## 🚀 Development Cache Busting

- Use `?v=timestamp` in URLs
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server after cache issues
