/**
 * Main Application Component
 * ==========================
 * [HASEEB] This is your component to implement.
 * 
 * Sets up routing and main layout for the app.
 */

// TODO: Import Routes, Route from react-router-dom
// WHY: Define application routes

// TODO: Import all page/component imports
// WHY: Components to render for each route

// TODO: Import layout components (Navbar, Sidebar)
// WHY: Consistent layout across pages

// TODO: Import auth context hook
// WHY: Check if user is authenticated for protected routes

function App() {
  // TODO: Get authentication state from context
  // WHY: Conditionally render routes based on auth status
  // APPROACH: const { user, isLoading } = useAuth()

  // TODO: Show loading state while checking auth
  // WHY: Prevent flash of wrong content
  // APPROACH: Return loading spinner if isLoading

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TODO: Add Navbar component */}
      {/* WHY: Navigation header for the app */}

      <div className="flex">
        {/* TODO: Add Sidebar component (show only when logged in) */}
        {/* WHY: Side navigation for logged in users */}

        <main className="flex-1 p-6">
          {/* TODO: Set up Routes */}
          {/* WHY: Define which component renders for each URL */}
          {/* 
          APPROACH: Define routes like:
          
          <Routes>
            {/* Public routes */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
            
            {/* Protected routes - wrap with ProtectedRoute component */}
            {/* <Route path="/" element={<Dashboard />} /> */}
            {/* <Route path="/habits" element={<HabitList />} /> */}
            {/* <Route path="/habits/new" element={<CreateHabit />} /> */}
            {/* <Route path="/habits/:id/edit" element={<EditHabit />} /> */}
            {/* <Route path="/analytics" element={<AnalyticsDashboard />} /> */}
            {/* <Route path="/ai" element={<AISuggestions />} /> */}
            {/* <Route path="/parties" element={<PartyList />} /> */}
            {/* <Route path="/parties/new" element={<CreateParty />} /> */}
            {/* <Route path="/parties/:id" element={<PartyDashboard />} /> */}
            {/* <Route path="/accountability" element={<PartnerDashboard />} /> */}
          {/* </Routes> */}
          
          <h1 className="text-2xl font-bold text-gray-800">
            Habit Tracker - Setup Routes Here
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome to your habit tracker! Implement the routes above to get started.
          </p>
        </main>
      </div>
    </div>
  )
}

// TODO: Create ProtectedRoute component
// WHY: Redirect unauthenticated users to login
// APPROACH: Check auth, redirect if not logged in
/*
function ProtectedRoute({ children }) {
  // TODO: Get auth state
  // WHY: Check if user is logged in
  
  // TODO: Redirect to login if not authenticated
  // WHY: Protect private routes
  // APPROACH: Navigate to /login if no user
  
  // TODO: Return children if authenticated
  // WHY: Render the protected content
}
*/

export default App

