import Navigation from "./navigation-component";

export default function DashboardLayout({
  children,
  title,
  detail,
}: {
  children: any;
  title: string;
  detail?: string;
}) {
  return (
    <>
      <div className="md:flex">
        <Navigation />
        <div className="min-h-screen bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 w-full md:w-4/5">
          {/* Banner for titles */}
          <div className="bg-white text-black py-3 px-8">
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            <h1 className="text-lg text-gray-500 font-light">{detail}</h1>
          </div>

          {/* Children content */}
          <div className="bg-gray-100 h-full p-6">{children}</div>
        </div>
        
      </div>
    </>
  );
}
