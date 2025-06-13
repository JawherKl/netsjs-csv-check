# NestJS CSV Processor

This project is a NestJS application designed to process CSV uploads with multiple levels of validation and checks. It utilizes MinIO for storage and PostgreSQL for data management.

## Features

- CSV file upload and processing
- Multi-level validation of CSV data
- Integration with MinIO for file storage
- PostgreSQL for data persistence

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nestjs-csv-processor.git
   cd nestjs-csv-processor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and configure your environment variables.

## Running the Application

To start the application, run:
```bash
npm run start
```

## Testing

To run the tests, use:
```bash
npm run test
```

## Docker

To run the application using Docker, execute:
```bash
docker-compose up
```

## Implementation

### **Level 1: Basic Checks (Easy)**  
**Purpose**: Validate file integrity and basic structure.  
**Key Verifications**:  
1. **File Extension Validation** (e.g., `.csv` only)  
2. **File Size Check** (Reject excessively large files)  
3. **Non-Empty File Verification**  
4. **Encoding Detection** (e.g., UTF-8, ASCII)  

---

### **Level 2: Content Validation (Moderate)**  
**Purpose**: Ensure data format and schema compliance.  
**Key Verifications**:  
1. **Header/Column Validation**  
   - Expected column names  
   - Column count matching  
2. **Data Type Checks**  
   - Numbers, dates, emails, etc.  
3. **Required Fields** (Non-empty critical columns)  
4. **Delimiter Consistency** (Commas, semicolons)  
5. **Row Length Uniformity** (All rows have same columns)  

---

### **Level 3: Advanced Checks (Hard)**  
**Purpose**: Enforce security and business rules.  
**Key Verifications**:  
1. **Security Scans**  
   - Malicious scripts/HTML tags  
   - SQL/code injection patterns  
2. **Business Logic Validation**  
   - Value ranges (e.g., "Price > 0")  
   - Cross-field dependencies (e.g., "End date > Start date")  
3. **Data Consistency**  
   - Foreign key references (e.g., "User ID exists in database")  
   - Duplicate entry detection  
4. **Compliance Checks**  
   - PII masking (e.g., GDPR-compliant emails)  
   - Regulatory formatting (e.g., ISO date standards)  

---

### **Summary Table**  
| **Level**       | **Focus Area**       | **Example Checks**                              |  
|-----------------|----------------------|-----------------------------------------------|  
| **Basic**       | File Integrity       | Extension, size, non-empty                    |  
| **Moderate**    | Data Structure       | Headers, data types, required fields          |  
| **Advanced**    | Security & Business  | Injection scans, business rules, compliance  |

## License

This project is licensed under the MIT License. See the LICENSE file for details.