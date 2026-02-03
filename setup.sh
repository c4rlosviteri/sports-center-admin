#!/bin/bash
# Biciantro - Quick Setup Script

echo "🚀 Biciantro Setup Script"
echo "=========================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found"
    echo "📦 Installing PostgreSQL..."
    brew install postgresql@15
    brew services start postgresql@15
    echo "✅ PostgreSQL installed and started"
else
    echo "✅ PostgreSQL found"
fi

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw biciantro; then
    echo "⚠️  Database 'biciantro' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb biciantro
        echo "📦 Creating database..."
        createdb biciantro
    fi
else
    echo "📦 Creating database 'biciantro'..."
    createdb biciantro
    echo "✅ Database created"
fi

# Apply schema
echo "📋 Applying database schema..."
psql biciantro < db/schema.sql
if [ $? -eq 0 ]; then
    echo "✅ Schema applied successfully"
else
    echo "❌ Failed to apply schema"
    exit 1
fi

# Load seed data
echo "🌱 Loading seed data..."
psql biciantro < db/seed.sql
if [ $? -eq 0 ]; then
    echo "✅ Seed data loaded successfully"
else
    echo "❌ Failed to load seed data"
    exit 1
fi

# Verify installation
echo ""
echo "🔍 Verifying installation..."
TABLE_COUNT=$(psql biciantro -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
echo "   Tables created: $TABLE_COUNT"

USER_COUNT=$(psql biciantro -t -c "SELECT COUNT(*) FROM users;")
echo "   Users created: $USER_COUNT"

PLAN_COUNT=$(psql biciantro -t -c "SELECT COUNT(*) FROM membership_plans;")
echo "   Plans created: $PLAN_COUNT"

CLASS_COUNT=$(psql biciantro -t -c "SELECT COUNT(*) FROM classes;")
echo "   Classes created: $CLASS_COUNT"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Test Credentials:"
echo "   Admin:  admin@biciantro.ec / password123"
echo "   Client: juan.perez@example.com / password123"
echo ""
echo "🚀 Next steps:"
echo "   1. pnpm dev          # Start development server"
echo "   2. Open http://localhost:3000"
echo "   3. Login with test credentials"
echo ""
echo "📚 Documentation:"
echo "   - SETUP.md for detailed instructions"
echo "   - COMPLETION.md for project summary"
echo ""
