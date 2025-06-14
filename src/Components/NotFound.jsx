import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Page not found</p>
      <Link
        to="/dashboard"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go back dashboard
      </Link>
    </div>
  );
}