import { ArrowLeft } from "@/utils/svg";
import Navigation from "./navigation-component";

export default function DashboardLayout({
  children,
  title,
  detail,
  dynamic,
  onclick,
}: {
  children: any;
  title: string;
  detail?: string;
  dynamic?: boolean;
  onclick?: () => void;
}) {
  return (
    <>
      <div className="md:flex">
        <Navigation />
        <div className="min-h-screen bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 w-full md:w-4/5">
          {/* Banner for titles */}
          <div
            className={`bg-white text-black py-3 px-8 flex ${
              dynamic ? "flex-col-reverse" : "flex-col"
            }`}
          >
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            <div className="flex items-center">
              {dynamic && (
                <div className="mr-2  cursor-pointer" onClick={onclick}>
                  <ArrowLeft />
                </div>
              )}
              <h1 className="text-lg text-gray-500 font-light">{detail}</h1>
            </div>
          </div>

          {/* Children content */}
          <div className="bg-gray-100 h-full p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
