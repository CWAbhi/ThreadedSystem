
echo "🚀 Starting Threaded Comment System..."
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB or use MongoDB Atlas."
        echo "   To start local MongoDB: mongod"
    fi
else
    echo "⚠️  MongoDB not found. Please install MongoDB or use MongoDB Atlas."
fi

echo ""
echo "📦 Installing dependencies..."

echo "Installing server dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Installing client dependencies..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo "🎯 Starting servers..."

echo "Starting backend server on port 5000..."
cd ../server
npm run dev &
SERVER_PID=$!

sleep 3

echo "Starting frontend development server on port 5173..."
cd ../client
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo "🏥 Health:   http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop both servers"

cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM
wait