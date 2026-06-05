export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-600" />
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
