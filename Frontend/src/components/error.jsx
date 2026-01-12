import React from "react";

const ErrorState = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-6 text-center"
      role="alert"
    >
      <p className="text-sm text-red-600">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
