# Cache Clearing Commands

## 🧹 Development Cache Clearing

### **Frontend Cache:**

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Clear npm cache
npm cache clean --force

# Clear browser cache (Chrome)
rm -rf ~/Library/Caches/Google/Chrome/Default/Cache
```

### **Backend Cache:**

```bash
# Clear Maven cache
mvn clean

# Clear target directory
rm -rf target/
```

### **System Cache (macOS):**

```bash
# Clear system cache
sudo rm -rf /Library/Caches/*
sudo rm -rf ~/Library/Caches/*
```

## 🔄 Complete Reset:

```bash
# Stop all processes
./scripts/stop-dev.sh

# Clear all caches
rm -rf node_modules/.vite
rm -rf kch-backend/target/
npm cache clean --force
mvn clean

# Restart
./scripts/start-dev.sh
```
