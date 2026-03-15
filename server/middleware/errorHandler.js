// Fallback for unknown routes.
export const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found." });
};

// Centralized error formatter for API responses.
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error.";
  res.status(status).json({ message });
}; 

