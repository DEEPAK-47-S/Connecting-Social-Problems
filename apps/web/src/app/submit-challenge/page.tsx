import Link from "next/link";

export default function SubmitChallengePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Submit a Societal Challenge
          </h1>
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
            Describe the problem affecting your community so our AI can match it with the right university and industry partners.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
          <form className="space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                  Challenge Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                    placeholder="e.g., Smart Water Quality Monitoring for Rural Villages"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                  Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    required
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                  >
                    <option value="">Select a category</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Water Management">Water Management</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Smart City">Smart City</option>
                    <option value="Environment">Environment</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                  Location (District/City)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="district"
                    id="district"
                    required
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                    placeholder="e.g., Ranchi, Jharkhand"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                  Detailed Problem Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700"
                    placeholder="Describe the problem, who is affected, and why it needs solving..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-x-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Submit & Trigger AI Analysis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
