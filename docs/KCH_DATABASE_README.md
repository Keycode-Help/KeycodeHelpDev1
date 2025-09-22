# KCH Key Chip Database

## Overview

The KCH Key Chip Database is a comprehensive, interactive database system that provides automotive transponder and key chip information to authorized users. It's designed to be fast, accessible, and secure, with copy-protection features to prevent unauthorized distribution of proprietary data.

## Features

### 🔍 **Advanced Search & Filtering**
- **Free-text search**: Search by chip type, OEM code, vehicle details, or any combination
- **Smart filters**: Filter by make, model, year range, system type, and transponder family
- **Autocomplete suggestions**: Real-time suggestions for OEM codes and transponder families
- **Fuzzy matching**: Find results even with partial or misspelled search terms

### 🚗 **Comprehensive Vehicle Coverage**
- **Make & Model**: All major automotive manufacturers and their vehicle models
- **Year ranges**: Support for both specific year ranges (e.g., "2018-2021") and open-ended ranges (e.g., "2020+")
- **System types**: Anti-theft systems, security protocols, and vehicle electronics
- **Transponder families**: ID46, ID48, Hitag2, Megamos, and many more

### 🛡️ **Security & Access Control**
- **Role-based access**: Only `BASEUSER`, `ADMIN`, and `SUPER_ADMIN` roles can access
- **Trial validation**: Automatic trial status checking for `BASEUSER` accounts
- **Copy protection**: Multiple layers of protection against bulk copying and export
- **Audit logging**: Track all access attempts and search queries

### 📱 **Modern, Responsive UI**
- **Mobile-first design**: Optimized for all device sizes
- **Dark mode support**: Automatic theme switching based on system preferences
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Virtualized results grid for handling large datasets

## Technical Architecture

### Backend (Java/Spring Boot)

#### **Database Schema**
```sql
-- Core entities
make (id, name, pricing)
model (id, make_id, name)
vehicle_range (id, model_id, year_from, year_to, year_note)

-- Transponder data
system_type (id, name)
transponder_family (id, name)
transponder_detail (id, detail)
cross_ref (id, label)
oem_key (id, code)
note (id, text)

-- Fact table
entry (id, vehicle_range_id, system_type_id, transponder_family_id, transponder_detail_id)

-- Junction tables for many-to-many relationships
entry_cross_ref, entry_oem_key, entry_note
```

#### **Key Services**
- **`TransponderDatabaseService`**: Main business logic for search and data retrieval
- **`TransponderEtlService`**: ETL processing for ingesting markdown data
- **`AdminRegistrationCodeService`**: User management and access control

#### **API Endpoints**
```
GET  /api/kch/search              - Search transponder entries
GET  /api/kch/entry/{id}          - Get specific entry details
GET  /api/kch/makes               - List all vehicle makes
GET  /api/kch/makes/{id}/models   - Get models for a specific make
GET  /api/kch/system-types        - List all system types
GET  /api/kch/transponder-families - List all transponder families
GET  /api/kch/suggestions         - Get search suggestions
GET  /api/kch/stats               - Database statistics
POST /api/kch/etl/run            - Run ETL process (Admin only)
GET  /api/kch/etl/logs           - View ETL logs (Admin only)
```

### Frontend (React/Vite)

#### **Components**
- **`KchDatabase`**: Main page component with search and results
- **`ResultCard`**: Individual result display with expandable details
- **`FilterPanel`**: Advanced filtering interface
- **`SearchBar`**: Intelligent search with autocomplete

#### **State Management**
- **Local state**: Filters, search terms, pagination
- **Context**: Authentication and user role management
- **API integration**: RESTful communication with backend

#### **Copy Protection Features**
- **Text selection disabled**: `user-select: none` CSS property
- **Print blocking**: CSS `@media print` rules
- **Copy event interception**: JavaScript event handlers
- **Dynamic watermarks**: Session-based overlay protection

## Installation & Setup

### Prerequisites
- Java 21+
- Maven 3.8+
- PostgreSQL 14+
- Node.js 18+
- Vite

### Backend Setup

1. **Database Configuration**
   ```bash
   # Run the schema.sql file to create tables
   psql -d your_database -f kch-backend/src/main/resources/schema.sql
   ```

2. **Environment Variables**
   ```bash
   # Add to .env file
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/kch_database
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   ```

3. **Build & Run**
   ```bash
   cd kch-backend
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd kch-frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Add to .env file
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

## Data Ingestion

### ETL Process

The system includes an automated ETL (Extract, Transform, Load) process that parses the `Transponder data.md` file and populates the database.

#### **Running ETL**
```bash
# Via API (Admin only)
POST /api/kch/etl/run

# Via service
@Autowired
private TransponderEtlService etlService;
etlService.runEtl();
```

#### **ETL Features**
- **Markdown parsing**: Automatically detects and parses table structures
- **Data normalization**: Splits multi-value fields and handles synonyms
- **Duplicate prevention**: Idempotent processing with conflict resolution
- **Progress tracking**: Real-time status updates and error logging

### Data Source Format

The system expects markdown tables with the following structure:
```markdown
| Make | Model | Year From | Year To | System Type | Transponder Family | Transponder Detail | Cross-Refs | OEM Keys | Notes |
|------|-------|-----------|---------|-------------|-------------------|-------------------|------------|----------|-------|
| Chevrolet | Camaro | 2010 | 2015 | | Hitag2 Extended / ~ID46, ID46E | PCF7937E, NCF2951E | | 5912545, OHT01060512 | |
```

## Usage Examples

### Basic Search
1. Navigate to `/kch-db`
2. Enter search terms in the search bar
3. Use filters to narrow results
4. Click on result cards to expand details

### Advanced Filtering
1. Click "Filters" to open the filter panel
2. Select make and model from dropdowns
3. Set year range (from/to)
4. Choose system type and transponder family
5. Click "Apply Filters"

### Copying Information
1. Click "Copy Summary" for basic vehicle info
2. Click individual copy buttons for specific data
3. Use "Copy Creds" for portal login details

## Security Considerations

### Access Control
- **Authentication required**: All endpoints require valid JWT tokens
- **Role validation**: Server-side role checking on all requests
- **Rate limiting**: API endpoints include rate limiting to prevent abuse

### Data Protection
- **No bulk export**: Copy protection prevents mass data extraction
- **Session watermarks**: Dynamic overlays with user identification
- **Audit trails**: Comprehensive logging of all user actions

### Privacy
- **No PII exposure**: User data is never exposed in search results
- **Anonymized logging**: Search queries are logged without user identification
- **Secure storage**: All sensitive data is encrypted at rest

## Performance Optimization

### Database Indexing
- **Full-text search**: GIN indexes on transponder families and details
- **Trigram matching**: Fuzzy search capabilities for OEM codes
- **Composite indexes**: Optimized for common filter combinations

### Caching Strategy
- **Redis integration**: Hot query caching with TTL
- **Browser caching**: Static assets and API responses
- **Query optimization**: Efficient SQL with proper join strategies

### Frontend Performance
- **Virtual scrolling**: Handle large result sets efficiently
- **Lazy loading**: Load data only when needed
- **Debounced search**: Reduce API calls during typing

## Monitoring & Maintenance

### Health Checks
- **Database connectivity**: Regular connection testing
- **API responsiveness**: Endpoint health monitoring
- **User experience**: Performance metrics and error tracking

### Logging
- **Access logs**: User authentication and authorization attempts
- **Search logs**: Query patterns and result counts
- **Error logs**: System failures and debugging information

### Backup & Recovery
- **Regular backups**: Automated database backups
- **Data integrity**: Checksum validation and consistency checks
- **Disaster recovery**: Point-in-time recovery procedures

## Troubleshooting

### Common Issues

#### **Search Not Working**
- Check database connectivity
- Verify ETL process has run successfully
- Check API endpoint availability

#### **Slow Performance**
- Review database query performance
- Check index usage and optimization
- Monitor Redis cache hit rates

#### **Access Denied**
- Verify user role and permissions
- Check JWT token validity
- Confirm trial status for BASEUSER accounts

### Debug Mode
Enable debug logging in `application.properties`:
```properties
logging.level.org.rma.kchbackend=DEBUG
logging.level.org.springframework.web=DEBUG
```

## Contributing

### Development Guidelines
- Follow existing code patterns and naming conventions
- Include comprehensive tests for new features
- Update documentation for API changes
- Follow security best practices

### Testing
```bash
# Backend tests
mvn test

# Frontend tests
npm test

# Integration tests
mvn verify
```

## License

This system is proprietary to Keycode Help and is protected by copyright law. Unauthorized copying, distribution, or modification is strictly prohibited.

## Support

For technical support or questions about the KCH Database:
- **Email**: support@keycodehelp.com
- **Documentation**: [Internal Wiki]
- **Issue Tracking**: [JIRA Project]

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: KCH Development Team
