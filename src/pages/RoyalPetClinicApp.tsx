import React, { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import Login from "./Login";
import { 
  Users, 
  Dog, 
  Calendar, 
  Package, 
  LayoutDashboard, 
  LogOut,
  Plus
} from "lucide-react";

type Tab = "dashboard" | "owners" | "pets" | "appointments" | "inventory";

export default function RoyalPetClinicApp() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const bootstrap = await apiFetch("/bootstrap");
        setData([bootstrap]);
      } else {
        const result = await apiFetch(`/${activeTab}`);
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  if (!token) return <Login />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600">Royal Pet</h1>
          <p className="text-xs text-gray-400 capitalize">{user.role || "Guest"}</p>
        </div>
        <nav className="mt-6 space-y-1 px-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("owners")}
            className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "owners" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Users className="mr-3 h-5 w-5" /> Owners
          </button>
          <button
            onClick={() => setActiveTab("pets")}
            className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "pets" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Dog className="mr-3 h-5 w-5" /> Pets
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "appointments" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Calendar className="mr-3 h-5 w-5" /> Appointments
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex w-full items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === "inventory" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <Package className="mr-3 h-5 w-5" /> Inventory
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={logout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
          >
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 capitalize">{activeTab}</h2>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </button>
        </header>

        <section className="bg-white shadow rounded-lg p-6 min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === "dashboard" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="text-sm font-medium text-indigo-600">Total Pets</h3>
                    <p className="text-2xl font-bold text-indigo-900">{data[0]?.pets?.length || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Active Owners</h3>
                    <p className="text-2xl font-bold text-green-900">{data[0]?.owners?.length || 0}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-sm font-medium text-orange-600">Appointments</h3>
                    <p className="text-2xl font-bold text-orange-900">{data[0]?.appointments?.length || 0}</p>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500 text-sm">No records found</td>
                      </tr>
                    ) : (
                      data.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{item.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name || item.date || item.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mobile || item.type || item.status || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at || Date.now()).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
