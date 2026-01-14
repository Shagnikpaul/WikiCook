#!/bin/sh
set -e
echo "LMAO"
echo "🔧 Running Better Auth generate..."
better-auth generate

echo "🗄️ Running Better Auth migrate..."
better-auth migrate

echo "🚀 Starting Better Auth service..."
npm run dev