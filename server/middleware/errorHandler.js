// NOTE: If a request doesn't match any route, this sends back a 404 JSON response.
export const notFound = (req, res, _next) => {
  void _next;
  res.status(404).json({ message: "Route not found." });
};

// NOTE: Any thrown error ends up here so we return a clean JSON error to the client.
export const errorHandler = (err, req, res, _next) => {
  void _next;
  const status = err.statusCode || 500;
  const message = err.message || "Server error.";
  res.status(status).json({ message });
}; 

