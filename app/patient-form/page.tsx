"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, type PatientFormData } from "@/lib/validators";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import Link from "next/link";

export default function PatientForm() {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 5);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize form with Zod resolver
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    mode: "onChange",
  });

  /**
   * Handles the final form submission.
   * Sends a "submitted" status to the Staff View via Pusher.
   */
  const onSubmit = async (data: PatientFormData) => {
    try {
      // Send the final form data to the server
      await fetch("/api/sync-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "submitted", // Change status to "submitted"
          timestamp: new Date().toISOString(),
        }),
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  // Function: Clear Form & Reset Staff View
  const handleClear = async () => {
    reset();

    try {
      await fetch("/api/sync-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "reset",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Real-time Data Synchronization
   * Watches for any changes in the form fields and prepares to send updates.
   */
  useEffect(() => {
    const subscription = watch((value) => {
      const timeoutId = setTimeout(async () => {
        try {
          await fetch("/api/sync-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...value,
              status: "typing",
              timestamp: new Date().toISOString(),
            }),
          });
          console.log("Synced to staff view");
        } catch (error) {
          console.error("Sync failed:", error);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Registration
          </h1>
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer text-sm text-gray-400 hover:text-red-500 underline decoration-dotted underline-offset-4 transition-colors"
          >
            Clear Form
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register("firstName")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Elon"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Middle Name{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                {...register("middleName")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register("lastName")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Musk"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                max={maxDateString}
                onKeyDown={(e) => e.preventDefault()}
                {...register("dateOfBirth")}
                className="cursor-pointer mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                {...register("gender")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Contact Details Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0812345678"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="elon@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                {...register("address")}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preferred Language
                </label>
                <input
                  {...register("preferredLanguage")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Thai, English"
                />
                {errors.preferredLanguage && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.preferredLanguage.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  {...register("nationality")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Thai"
                />
                {errors.nationality && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nationality.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Optional: Emergency Contact */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Emergency Contact{" "}
              <span className="text-sm font-normal text-gray-500">
                (Optional)
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  {...register("emergencyContactName")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  {...register("emergencyContactRelationship")}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Father, Sister"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h3>
            <p className="text-gray-500 mb-6">
              Your information has been securely transmitted to our staff.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
