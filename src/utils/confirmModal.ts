import Swal from "sweetalert2";

export const confirmAction = async (
  title: string,
  text: string,
  icon: "warning" | "error" | "success" | "info" = "warning",
) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",

    // Natively Synchronized Theme Colors
    background: "#05070a", // var(--background) equivalent
    color: "#e2e8f0", // var(--foreground) equivalent
    confirmButtonColor: "#7c3aed", // var(--primary)
    cancelButtonColor: "#1e293b", // var(--secondary)
  });

  return result.isConfirmed;
};
