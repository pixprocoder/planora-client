import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
  success?: boolean;
}

export const handleError = (
  error: unknown,
  fallbackMessage = "An unexpected error occurred",
) => {
  console.error("Error caught by global handler:", error);

  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    const message = data?.message || error.message || fallbackMessage;

    toast.error(message, {
      description: error.response?.status
        ? `Error Code: ${error.response.status}`
        : undefined,
    });
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message || fallbackMessage);
    return;
  }

  toast.error(fallbackMessage);
};
