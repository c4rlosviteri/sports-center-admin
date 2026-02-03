#!/bin/bash
# Migration Runner Script
# Runs all pending database migrations in order

set -e

# Configuration
DB_URL="${DATABASE_URL:-postgres://localhost:5432/biciantro}"
MIGRATIONS_DIR="$(dirname "$0")/migrations"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "  Biciantro Database Migration Runner"
echo "======================================"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql command not found${NC}"
    echo "Please install PostgreSQL client tools"
    exit 1
fi

# Test database connection
echo "Testing database connection..."
if ! psql "$DB_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to database${NC}"
    echo "Database URL: $DB_URL"
    exit 1
fi
echo -e "${GREEN}✓ Connected to database${NC}"
echo ""

# Get list of migration files
MIGRATION_FILES=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort || echo "")

if [ -z "$MIGRATION_FILES" ]; then
    echo -e "${YELLOW}No migration files found in $MIGRATIONS_DIR${NC}"
    exit 0
fi

# Count total migrations
TOTAL=$(echo "$MIGRATION_FILES" | wc -l | tr -d ' ')
echo "Found $TOTAL migration file(s)"
echo ""

# Run each migration
COUNT=0
APPLIED=0
SKIPPED=0

for MIGRATION_FILE in $MIGRATION_FILES; do
    COUNT=$((COUNT + 1))
    FILENAME=$(basename "$MIGRATION_FILE")
    VERSION=$(echo "$FILENAME" | cut -d'_' -f1)

    # Check if migration has already been applied
    ALREADY_APPLIED=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM schema_migrations WHERE version = '$VERSION'" 2>/dev/null || echo "0")
    ALREADY_APPLIED=$(echo "$ALREADY_APPLIED" | tr -d ' ')

    if [ "$ALREADY_APPLIED" -gt 0 ]; then
        echo -e "[$COUNT/$TOTAL] ${YELLOW}SKIP${NC} $FILENAME (already applied)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    echo -e "[$COUNT/$TOTAL] ${GREEN}RUN${NC}  $FILENAME"

    # Run migration and capture time
    START_TIME=$(date +%s%3N)

    if psql "$DB_URL" -f "$MIGRATION_FILE" > /dev/null 2>&1; then
        END_TIME=$(date +%s%3N)
        EXECUTION_TIME=$((END_TIME - START_TIME))
        echo -e "       ${GREEN}✓ Success${NC} (${EXECUTION_TIME}ms)"
        APPLIED=$((APPLIED + 1))
    else
        echo -e "       ${RED}✗ Failed${NC}"
        echo -e "${RED}Migration failed: $FILENAME${NC}"
        exit 1
    fi
done

echo ""
echo "======================================"
echo "Migration Summary:"
echo "  Total: $TOTAL"
echo "  Applied: $APPLIED"
echo "  Skipped: $SKIPPED"
echo "======================================"
echo -e "${GREEN}All migrations completed successfully!${NC}"
