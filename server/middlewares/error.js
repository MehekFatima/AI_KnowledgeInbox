
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const message = err.message || "Internal server error.";

  const clientErrors = [
    "Source type must be note or url.",
    "Note content is required.",
    "A valid URL is required.",
    "Only HTTP and HTTPS URLs are supported.",
    "Private network URLs are not allowed.",
    "URLs containing credentials are not allowed.",
    "URL hostname",
    "Unable to resolve",
    "Redirects are not supported",
    "The supplied URL must return an HTML webpage.",
    "Webpage exceeds",
    "No readable content found",
    "No usable content was found."
  ];

  const isClientError = clientErrors.some((item) =>
    message.includes(item)
  );

  const statusCode = isClientError
    ? 400
    : message.startsWith("Unable to fetch webpage: HTTP ")
      ? 422
      : 500;

  req.log?.error({ err, statusCode }, "Request failed");

  return res.status(statusCode).json({
    success: false,
    message: statusCode < 500 ? message : "An unexpected error occurred."
  });
};
